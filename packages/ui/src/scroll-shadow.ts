import type { ScrollShadowVariants } from "@heroui/styles/components/scroll-shadow";
import { scrollShadowVariants } from "@heroui/styles/components/scroll-shadow";
import { Effect, Queue, Schema as S, Stream } from "effect";
import { Mount } from "foldkit";
import type { Attribute, Html, HtmlBuilder } from "foldkit/html";

import { classes } from "./shared";

type Content = string | Html;

/** ScrollShadow 的逻辑边缘可见状态。 */
export const Visibility = S.Literals(["None", "Start", "End", "Both"]);
export type Visibility = typeof Visibility.Type;

/** ScrollShadow 的滚动方向。 */
export const Orientation = S.Literals(["Vertical", "Horizontal"]);
export type Orientation = typeof Orientation.Type;

/** 观察滚动位置、viewport 与内容变化，并发出当前可见边缘。 */
export const ObserveScrollShadow = Mount.defineStream(
  "ObserveScrollShadow",
  { orientation: Orientation, offset: S.Finite },
  Visibility,
)(
  ({ orientation, offset }) =>
    (element) =>
      Stream.callback<Visibility>((queue) =>
        Effect.acquireRelease(
          Effect.sync(() => {
            if (!(element instanceof HTMLElement)) {
              throw new Error("ScrollShadow mount target must be an HTMLElement");
            }

            const updateVisibility = () => {
              const isVertical = orientation === "Vertical";
              const scrollPosition = isVertical ? element.scrollTop : Math.abs(element.scrollLeft);
              const viewportSize = isVertical ? element.clientHeight : element.clientWidth;
              const contentSize = isVertical ? element.scrollHeight : element.scrollWidth;
              const hasStart = scrollPosition > offset;
              const hasEnd = scrollPosition + viewportSize + offset < contentSize - 1;
              let visibility: Visibility;
              if (hasStart && hasEnd) {
                visibility = "Both";
              } else if (hasStart) {
                visibility = "Start";
              } else if (hasEnd) {
                visibility = "End";
              } else {
                visibility = "None";
              }
              Queue.offerUnsafe(queue, Visibility.make(visibility));
            };
            const scrollListener = () => updateVisibility();
            const resizeObserver = new ResizeObserver(updateVisibility);
            const mutationObserver = new MutationObserver(updateVisibility);

            element.addEventListener("scroll", scrollListener, { passive: true });
            resizeObserver.observe(element);
            mutationObserver.observe(element, {
              childList: true,
              subtree: true,
              characterData: true,
            });
            updateVisibility();
            return { mutationObserver, resizeObserver, scrollListener };
          }),
          ({ mutationObserver, resizeObserver, scrollListener }) =>
            Effect.sync(() => {
              element.removeEventListener("scroll", scrollListener);
              resizeObserver.disconnect();
              mutationObserver.disconnect();
            }),
        ).pipe(Effect.andThen(Effect.never)),
      ),
);

/** ScrollShadow 的视觉、外部可见状态与 Mount Message 配置。 */
export type ViewConfig<Message> = Omit<ScrollShadowVariants, "orientation"> &
  Readonly<{
    content: ReadonlyArray<Content>;
    visibility: Visibility;
    onVisibilityChange: (visibility: Visibility) => Message;
    orientation?: Orientation;
    offset?: number;
    isEnabled?: boolean;
    size?: number;
    attributes?: ReadonlyArray<Attribute<Message>>;
    className?: string;
  }>;

const visibilityAttributes = <Message>(
  orientation: Orientation,
  visibility: Visibility,
  h: HtmlBuilder<Message>,
): ReadonlyArray<Attribute<Message>> => {
  if (visibility === "None") {
    return [];
  }
  if (orientation === "Vertical") {
    if (visibility === "Both") {
      return [h.DataAttribute("top-bottom-scroll", "true")];
    }
    return [h.DataAttribute(visibility === "Start" ? "top-scroll" : "bottom-scroll", "true")];
  }
  if (visibility === "Both") {
    return [h.DataAttribute("left-right-scroll", "true")];
  }
  return [h.DataAttribute(visibility === "Start" ? "left-scroll" : "right-scroll", "true")];
};

const heroOrientation = (orientation: Orientation): "vertical" | "horizontal" =>
  orientation === "Vertical" ? "vertical" : "horizontal";

const callerAttributes = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.filter((attribute) => attribute._tag !== "Class");

const callerClasses = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): ReadonlyArray<string> =>
  attributes.flatMap((attribute) => (attribute._tag === "Class" ? [attribute.value] : []));

/** 使用 Foldkit Mount 投射 HeroUI ScrollShadow 的滚动边缘视觉。 */
export const view = <Message>(config: ViewConfig<Message>, h: HtmlBuilder<Message>): Html => {
  const orientation = config.orientation ?? "Vertical";
  const slots = scrollShadowVariants({
    hideScrollBar: config.hideScrollBar,
    orientation: heroOrientation(orientation),
    variant: config.variant,
  });
  const offset = config.offset ?? 0;
  const size = config.size ?? 40;
  const mount = Mount.mapMessage(
    ObserveScrollShadow({ orientation, offset }),
    config.onVisibilityChange,
  );
  const attributes = config.attributes ?? [];

  return h.div(
    [
      ...callerAttributes(attributes),
      ...visibilityAttributes(orientation, config.visibility, h),
      ...(config.isEnabled === false ? [] : [h.OnMount(mount)]),
      h.Style({ "--scroll-shadow-size": `${size}px` }),
      h.DataAttribute("orientation", orientation.toLowerCase()),
      h.DataAttribute("slot", "scroll-shadow"),
      h.Class(classes(slots.base(), ...callerClasses(attributes), config.className)),
    ],
    config.content,
  );
};

const ScrollShadow = { view };

/** Foldkit-native 的 HeroUI ScrollShadow 视觉与观察生命周期适配。 */
export default ScrollShadow;
