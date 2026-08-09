import { Array, Effect, Match as M, Option, Schema as S, pipe } from "effect";
import { Command, Runtime } from "foldkit";
import { Document, Html, HtmlBuilder } from "foldkit/html";
import { m } from "foldkit/message";
import { UrlRequest, back, forward, load, pushUrl, replaceUrl } from "foldkit/navigation";
import { Transition } from "foldkit/route";
import { evo } from "foldkit/struct";
import { Url, toString as urlToString } from "foldkit/url";

import * as Counter from "./counter";
import * as ComponentDocs from "./component-docs";
import { Example, exampleSourceUrl, examples, findExample } from "./example";
import * as UiShowcase from "./ui-showcase";
import {
  AppRoute,
  componentsIndexRouter,
  ProductId,
  deepRouter,
  exampleRouter,
  examplesIndexRouter,
  filesIndexRouter,
  filesRouter,
  filterRouter,
  guardedRouter,
  homeRouter,
  orderRouter,
  productRouter,
  routingHomeRouter,
  searchRouter,
  signInRouter,
  staticRouter,
  teamMemberRouter,
  urlToAppRoute,
  userRouter,
  vaultIndexRouter,
  vaultNoteRouter,
} from "./route";

const MAX_TRANSITION_LOG_ENTRIES = 8;
const DEMO_PRODUCT_ID = ProductId.make("3f2504e0-4f89-41d3-9a0c-0305e82c3301");

const routingRouteTags: ReadonlyArray<AppRoute["_tag"]> = [
  "RoutingHome",
  "Static",
  "Deep",
  "User",
  "Order",
  "Product",
  "TeamMember",
  "Search",
  "Filter",
  "FilesIndex",
  "Files",
  "VaultIndex",
  "VaultNote",
  "Guarded",
  "SignIn",
];

const isRoutingRoute = (route: AppRoute): boolean => Array.contains(routingRouteTags, route._tag);

const isComponentRoute = (route: AppRoute): boolean =>
  route._tag === "ComponentsIndex" ||
  route._tag === "ComponentsParts" ||
  route._tag === "ComponentsStandalone" ||
  route._tag === "ComponentPart" ||
  route._tag === "VisualProtocol";

const isCounterRoute = (route: AppRoute): boolean =>
  route._tag === "Example" && route.slug === "counter";

const routeLabel = (route: AppRoute): string => {
  if (route._tag === "Example") {
    return `Example(${route.slug})`;
  } else if (route._tag === "User") {
    return `User(${route.slug})`;
  } else if (route._tag === "Order") {
    return `Order(${route.orderId})`;
  } else if (route._tag === "Product") {
    return `Product(${route.productId})`;
  } else if (route._tag === "TeamMember") {
    return `TeamMember(${route.teamId}, ${route.memberId})`;
  } else if (route._tag === "Files") {
    return `Files(${route.path.join("/")})`;
  } else if (route._tag === "VaultNote") {
    return `VaultNote(${route.path})`;
  } else if (route._tag === "NotFound") {
    return `NotFound(${route.path})`;
  } else {
    return route._tag;
  }
};

const describeTransition = (transition: Transition.Transition<AppRoute>): string => {
  const maybeEnteredRoute = Transition.enteredAny(transition);
  const maybeExitedRoute = Transition.exitedAny(transition);

  if (Option.isSome(maybeEnteredRoute) && Option.isSome(maybeExitedRoute)) {
    return `exited ${routeLabel(maybeExitedRoute.value)} · entered ${routeLabel(maybeEnteredRoute.value)}`;
  } else if (Option.isSome(maybeEnteredRoute)) {
    return `cold load · entered ${routeLabel(maybeEnteredRoute.value)}`;
  } else {
    return Option.match(transition.maybePreviousRoute, {
      onNone: () => `cold load · entered ${routeLabel(transition.nextRoute)}`,
      onSome: (previousRoute) =>
        `stayed ${routeLabel(previousRoute)} → ${routeLabel(transition.nextRoute)}`,
    });
  }
};

// MODEL

export const Model = S.Struct({
  route: AppRoute,
  counter: Counter.Model,
  uiShowcase: UiShowcase.Model,
  transitionLog: S.Array(S.String),
  isSignedIn: S.Boolean,
});
export type Model = typeof Model.Type;

// MESSAGE

export const CompletedNavigateInternal = m("CompletedNavigateInternal");
export const CompletedLoadExternal = m("CompletedLoadExternal");
export const CompletedReplaceUrl = m("CompletedReplaceUrl");
export const CompletedNavigateBack = m("CompletedNavigateBack");
export const CompletedNavigateForward = m("CompletedNavigateForward");
export const ClickedLink = m("ClickedLink", { request: UrlRequest });
export const ChangedUrl = m("ChangedUrl", { url: Url });
export const ClickedReplaceUrl = m("ClickedReplaceUrl");
export const ClickedNavigateBack = m("ClickedNavigateBack");
export const ClickedNavigateForward = m("ClickedNavigateForward");
export const ClickedSignIn = m("ClickedSignIn");
export const ClickedSignOut = m("ClickedSignOut");
export const GotCounterMessage = m("GotCounterMessage", { message: Counter.Message });
export const GotUiShowcaseMessage = m("GotUiShowcaseMessage", {
  message: UiShowcase.Message,
});

export const Message = S.Union([
  CompletedNavigateInternal,
  CompletedLoadExternal,
  CompletedReplaceUrl,
  CompletedNavigateBack,
  CompletedNavigateForward,
  ClickedLink,
  ChangedUrl,
  ClickedReplaceUrl,
  ClickedNavigateBack,
  ClickedNavigateForward,
  ClickedSignIn,
  ClickedSignOut,
  GotCounterMessage,
  GotUiShowcaseMessage,
]);
export type Message = typeof Message.Type;

// COMMAND

const NavigateInternal = Command.define("NavigateInternal", {
  args: { url: S.String },
  messages: [CompletedNavigateInternal],
  execute: ({ url }) => pushUrl(url).pipe(Effect.as(CompletedNavigateInternal())),
});

const LoadExternal = Command.define("LoadExternal", {
  args: { href: S.String },
  messages: [CompletedLoadExternal],
  execute: ({ href }) => load(href).pipe(Effect.as(CompletedLoadExternal())),
});

const ReplaceUrl = Command.define("ReplaceUrl", {
  args: { url: S.String },
  messages: [CompletedReplaceUrl],
  execute: ({ url }) => replaceUrl(url).pipe(Effect.as(CompletedReplaceUrl())),
});

const NavigateBack = Command.define("NavigateBack", {
  messages: [CompletedNavigateBack],
  execute: back().pipe(Effect.as(CompletedNavigateBack())),
});

const NavigateForward = Command.define("NavigateForward", {
  messages: [CompletedNavigateForward],
  execute: forward().pipe(Effect.as(CompletedNavigateForward())),
});

const signInUrl = (): string => signInRouter({ redirectTo: Option.some(guardedRouter()) });

const commandsForRoute = (
  route: AppRoute,
  isSignedIn: boolean,
): ReadonlyArray<Command.Command<Message>> => {
  if (route._tag === "Guarded" && !isSignedIn) {
    return [ReplaceUrl({ url: signInUrl() })];
  } else {
    return [];
  }
};

// INIT

export const init: Runtime.RoutingApplicationInit<Model, Message> = (url: Url) => {
  const route = urlToAppRoute(url);
  const model = Model.make({
    route,
    counter: Counter.init(),
    uiShowcase: UiShowcase.init(),
    transitionLog: [describeTransition(Transition.coldLoad(route))],
    isSignedIn: false,
  });

  return [model, commandsForRoute(route, model.isSignedIn)];
};

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>];
const withUpdateReturn = M.withReturnType<UpdateReturn>();

export const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      CompletedNavigateInternal: () => [model, []],
      CompletedLoadExternal: () => [model, []],
      CompletedReplaceUrl: () => [model, []],
      CompletedNavigateBack: () => [model, []],
      CompletedNavigateForward: () => [model, []],

      ClickedLink: ({ request }) =>
        M.value(request).pipe(
          withUpdateReturn,
          M.tagsExhaustive({
            Internal: ({ url }) => [model, [NavigateInternal({ url: urlToString(url) })]],
            External: ({ href }) => [model, [LoadExternal({ href })]],
          }),
        ),

      ChangedUrl: ({ url }) => {
        const nextRoute = urlToAppRoute(url);
        const transition = Transition.make(model.route, nextRoute);
        const nextCounter =
          isCounterRoute(model.route) && !isCounterRoute(nextRoute)
            ? Counter.init()
            : model.counter;
        const nextTransitionLog = pipe(
          model.transitionLog,
          Array.prepend(describeTransition(transition)),
          Array.take(MAX_TRANSITION_LOG_ENTRIES),
        );
        const nextModel = evo(model, {
          route: () => nextRoute,
          counter: () => nextCounter,
          transitionLog: () => nextTransitionLog,
        });

        return [nextModel, commandsForRoute(nextRoute, nextModel.isSignedIn)];
      },

      ClickedReplaceUrl: () => [
        model,
        [
          ReplaceUrl({
            url: searchRouter({
              q: Option.some("replace"),
              page: Option.some(2),
              sort: Option.some("Desc"),
            }),
          }),
        ],
      ],

      ClickedNavigateBack: () => [model, [NavigateBack()]],
      ClickedNavigateForward: () => [model, [NavigateForward()]],

      ClickedSignIn: () => [
        evo(model, { isSignedIn: () => true }),
        [ReplaceUrl({ url: guardedRouter() })],
      ],

      ClickedSignOut: () => [
        evo(model, { isSignedIn: () => false }),
        [ReplaceUrl({ url: signInUrl() })],
      ],

      GotCounterMessage: ({ message: counterMessage }) => {
        const [nextCounter, counterCommands] = Counter.update(model.counter, counterMessage);
        return [
          evo(model, { counter: () => nextCounter }),
          Command.mapMessages(counterCommands, (childMessage) =>
            GotCounterMessage({ message: childMessage }),
          ),
        ];
      },

      GotUiShowcaseMessage: ({ message: uiShowcaseMessage }) => {
        const [nextUiShowcase, uiShowcaseCommands] = UiShowcase.update(
          model.uiShowcase,
          uiShowcaseMessage,
        );
        return [
          evo(model, { uiShowcase: () => nextUiShowcase }),
          Command.mapMessages(uiShowcaseCommands, (childMessage) =>
            GotUiShowcaseMessage({ message: childMessage }),
          ),
        ];
      },
    }),
  );

// VIEW

const pageHeaderView = (
  eyebrow: string,
  title: string,
  description: string,
  h: HtmlBuilder<Message>,
): Html =>
  h.header(
    [h.Class("mb-8")],
    [
      h.p([h.Class("text-xs font-black uppercase tracking-[0.22em] text-[#52704f]")], [eyebrow]),
      h.h1(
        [
          h.Class(
            "mt-3 max-w-4xl text-4xl font-black tracking-[-0.04em] text-[#172019] sm:text-6xl",
          ),
        ],
        [title],
      ),
      h.p([h.Class("mt-4 max-w-3xl text-lg leading-8 text-[#536055]")], [description]),
    ],
  );

const statusBadgeView = (example: Example, h: HtmlBuilder<Message>): Html => {
  const className =
    example.status === "Ready" ? "bg-[#dcebd9] text-[#28512d]" : "bg-[#e8e9e2] text-[#62675f]";

  return h.span(
    [h.Class(`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${className}`)],
    [example.status],
  );
};

const exampleCardView = (example: Example, h: HtmlBuilder<Message>): Html =>
  h.keyed("a")(
    example.slug,
    [
      h.Href(exampleRouter({ slug: example.slug })),
      h.Class(
        "group flex min-h-56 flex-col rounded-[1.75rem] border border-[#d5d9ce] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#6a8b66] hover:shadow-lg",
      ),
    ],
    [
      h.div(
        [h.Class("flex items-start justify-between gap-4")],
        [
          h.span([h.Class("font-mono text-sm text-[#7b8279]")], [`/${example.slug}`]),
          statusBadgeView(example, h),
        ],
      ),
      h.h2(
        [
          h.Class(
            "mt-8 text-2xl font-black tracking-tight text-[#172019] group-hover:text-[#28512d]",
          ),
        ],
        [example.title],
      ),
      h.p([h.Class("mt-3 flex-1 leading-7 text-[#626a61]")], [example.description]),
      h.p([h.Class("mt-5 text-sm font-bold text-[#52704f]")], [example.tags.join(" · ")]),
    ],
  );

const homeView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(
        "Foldkit Route Atlas",
        "One route for every official example.",
        "A production-shaped Foldkit application for exploring typed URL parsing, navigation, route lifecycles, and progressive View Transitions.",
        h,
      ),
      h.div(
        [h.Class("grid gap-4 lg:grid-cols-3")],
        [
          h.a(
            [
              h.Href(examplesIndexRouter()),
              h.Class("rounded-[2rem] bg-[#172019] p-8 text-white lg:col-span-2"),
            ],
            [
              h.p(
                [h.Class("text-sm font-black uppercase tracking-[0.18em] text-[#b8d8b4]")],
                ["31 official routes"],
              ),
              h.h2(
                [h.Class("mt-5 text-4xl font-black tracking-tight")],
                ["Browse the example atlas"],
              ),
              h.p(
                [h.Class("mt-3 max-w-xl leading-7 text-white/70")],
                [
                  "Counter and Routing Lab are live. Every remaining official example has a source-linked migration page.",
                ],
              ),
            ],
          ),
          h.a(
            [
              h.Href(routingHomeRouter()),
              h.Class("rounded-[2rem] bg-[#f0a04b] p-8 text-[#172019]"),
            ],
            [
              h.p([h.Class("text-sm font-black uppercase tracking-[0.18em]")], ["Routing Lab"]),
              h.h2(
                [h.Class("mt-5 text-3xl font-black tracking-tight")],
                ["Test every route shape"],
              ),
              h.p(
                [h.Class("mt-3 leading-7 text-[#493419]")],
                ["Real paths, query codecs, history controls, guards, fallbacks, and transitions."],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const examplesIndexView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(
        "Official examples",
        "The complete Foldkit example catalog.",
        "This manifest follows foldkit/foldkit. Each card resolves to its own stable page and official source.",
        h,
      ),
      h.div(
        [h.Class("grid gap-5 md:grid-cols-2 xl:grid-cols-3")],
        Array.map(examples, (example) => exampleCardView(example, h)),
      ),
    ],
  );

const sourceLinkView = (example: Example, h: HtmlBuilder<Message>): Html =>
  h.a(
    [
      h.Href(exampleSourceUrl(example.slug)),
      h.Target("_blank"),
      h.Rel("noreferrer"),
      h.Class(
        "inline-flex rounded-full border border-[#9aa394] px-4 py-2 text-sm font-bold text-[#2f4930] hover:bg-[#eef4e9]",
      ),
    ],
    ["Open official source ↗"],
  );

const plannedExampleView = (example: Example, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(example.difficulty, example.title, example.description, h),
      h.section(
        [h.Class("rounded-[2rem] border border-dashed border-[#9aa394] bg-white p-8")],
        [
          h.div(
            [h.Class("flex flex-wrap items-center gap-3")],
            [
              statusBadgeView(example, h),
              h.p(
                [h.Class("text-sm font-bold text-[#6b7168]")],
                ["Route ready · interactive port pending"],
              ),
            ],
          ),
          h.p(
            [h.Class("mt-6 max-w-2xl leading-7 text-[#596158]")],
            [
              "The page shell, deep link, active navigation state, and source attribution are complete. The official program will be migrated here without changing its internal interaction model.",
            ],
          ),
          h.div([h.Class("mt-7")], [sourceLinkView(example, h)]),
        ],
      ),
    ],
  );

const counterExampleView = (example: Example, model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(example.difficulty, example.title, example.description, h),
      h.submodel({
        slotId: "counter",
        model: model.counter,
        view: Counter.view,
        toParentMessage: (message) => GotCounterMessage({ message }),
      }),
      h.div([h.Class("mt-6")], [sourceLinkView(example, h)]),
    ],
  );

const uiShowcaseExampleView = (example: Example, model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(example.difficulty, example.title, example.description, h),
      h.submodel({
        slotId: "ui-showcase",
        model: model.uiShowcase,
        view: UiShowcase.view,
        toParentMessage: (message) => GotUiShowcaseMessage({ message }),
      }),
    ],
  );

const missingExampleView = (slug: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(
        "Resource not found",
        "The route matched, but the example does not exist.",
        `“${slug}” is a valid example-shaped URL. It is not present in the official manifest. This differs from a URL-level 404.`,
        h,
      ),
      h.a(
        [h.Href(examplesIndexRouter()), h.Class("font-bold text-[#28512d] underline")],
        ["Return to all examples"],
      ),
    ],
  );

const exampleView = (slug: string, model: Model, h: HtmlBuilder<Message>): Html =>
  Option.match(findExample(slug), {
    onNone: () => missingExampleView(slug, h),
    onSome: (example) => {
      if (example.slug === "counter") {
        return counterExampleView(example, model, h);
      } else if (example.slug === "ui-showcase") {
        return uiShowcaseExampleView(example, model, h);
      } else {
        return plannedExampleView(example, h);
      }
    },
  });

const routingLinkView = (
  href: string,
  label: string,
  currentRoute: AppRoute,
  isActive: (route: AppRoute) => boolean,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Href(href),
      ...(isActive(currentRoute) ? [h.AriaCurrent("page")] : []),
      h.Class(
        `rounded-full border px-3 py-2 text-sm font-bold transition ${isActive(currentRoute) ? "border-[#28512d] bg-[#28512d] text-white" : "border-[#c8cdc3] bg-white text-[#4d584e] hover:border-[#6a8b66]"}`,
      ),
    ],
    [label],
  );

const routingNavigationView = (route: AppRoute, h: HtmlBuilder<Message>): Html =>
  h.nav(
    [h.AriaLabel("Routing variants"), h.Class("flex flex-wrap gap-2")],
    [
      routingLinkView(
        routingHomeRouter(),
        "Overview",
        route,
        (candidate) => candidate._tag === "RoutingHome",
        h,
      ),
      routingLinkView(
        staticRouter(),
        "Static",
        route,
        (candidate) => candidate._tag === "Static",
        h,
      ),
      routingLinkView(deepRouter(), "Deep", route, (candidate) => candidate._tag === "Deep", h),
      routingLinkView(
        userRouter({ slug: "ada-lovelace" }),
        "String param",
        route,
        (candidate) => candidate._tag === "User",
        h,
      ),
      routingLinkView(
        orderRouter({ orderId: 42 }),
        "Integer param",
        route,
        (candidate) => candidate._tag === "Order",
        h,
      ),
      routingLinkView(
        productRouter({ productId: DEMO_PRODUCT_ID }),
        "Schema param",
        route,
        (candidate) => candidate._tag === "Product",
        h,
      ),
      routingLinkView(
        teamMemberRouter({ teamId: 7, memberId: 19, tab: Option.some("Activity") }),
        "Path + query",
        route,
        (candidate) => candidate._tag === "TeamMember",
        h,
      ),
      routingLinkView(
        searchRouter({ q: Option.some("foldkit"), page: Option.some(2), sort: Option.some("Asc") }),
        "Typed query",
        route,
        (candidate) => candidate._tag === "Search",
        h,
      ),
      routingLinkView(
        filterRouter({ tags: Option.some(["effect", "routing"]) }),
        "Query codec",
        route,
        (candidate) => candidate._tag === "Filter",
        h,
      ),
      routingLinkView(
        filesIndexRouter(),
        "Rest array",
        route,
        (candidate) => candidate._tag === "FilesIndex" || candidate._tag === "Files",
        h,
      ),
      routingLinkView(
        vaultIndexRouter(),
        "Rest string",
        route,
        (candidate) => candidate._tag === "VaultIndex" || candidate._tag === "VaultNote",
        h,
      ),
      routingLinkView(
        guardedRouter(),
        "Guard",
        route,
        (candidate) => candidate._tag === "Guarded" || candidate._tag === "SignIn",
        h,
      ),
    ],
  );

const routeValueView = (label: string, value: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("rounded-2xl bg-[#eef1e9] p-4")],
    [
      h.dt([h.Class("text-xs font-black uppercase tracking-wider text-[#687266]")], [label]),
      h.dd([h.Class("mt-2 break-all font-mono text-sm font-bold text-[#203c25]")], [value]),
    ],
  );

const routeDetailView = (
  title: string,
  summary: string,
  values: ReadonlyArray<Readonly<{ label: string; value: string }>>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("rounded-[2rem] bg-white p-7 shadow-sm")],
    [
      h.p(
        [h.Class("text-xs font-black uppercase tracking-[0.2em] text-[#52704f]")],
        ["Matched route"],
      ),
      h.h2([h.Class("mt-3 text-3xl font-black tracking-tight text-[#172019]")], [title]),
      h.p([h.Class("mt-3 max-w-2xl leading-7 text-[#5d665c]")], [summary]),
      h.dl(
        [h.Class("mt-7 grid gap-3 md:grid-cols-2")],
        Array.map(values, ({ label, value }) => routeValueView(label, value, h)),
      ),
    ],
  );

const navigationControlsView = (h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("rounded-[2rem] bg-[#172019] p-7 text-white")],
    [
      h.h2([h.Class("text-2xl font-black")], ["History commands"]),
      h.p(
        [h.Class("mt-2 text-white/65")],
        ["Push comes from typed links. These controls exercise replace, back, and forward."],
      ),
      h.div(
        [h.Class("mt-6 flex flex-wrap gap-3")],
        [
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedReplaceUrl()),
              h.Class("rounded-full bg-[#f0a04b] px-4 py-2 font-bold text-[#172019]"),
            ],
            ["Replace URL"],
          ),
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedNavigateBack()),
              h.Class("rounded-full border border-white/30 px-4 py-2 font-bold"),
            ],
            ["← Back"],
          ),
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedNavigateForward()),
              h.Class("rounded-full border border-white/30 px-4 py-2 font-bold"),
            ],
            ["Forward →"],
          ),
        ],
      ),
    ],
  );

const boundariesView = (h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("rounded-[2rem] border border-[#d4b17a] bg-[#fff5df] p-7")],
    [
      h.h2([h.Class("text-2xl font-black text-[#493419]")], ["Capability boundaries"]),
      h.ul(
        [h.Class("mt-4 list-disc space-y-2 pl-5 leading-7 text-[#6a4d29]")],
        [
          h.li([], ["Optional path segments use two explicit routers."]),
          h.li([], ["Deep paths do not imply nested layouts or outlets."]),
          h.li([], ["Redirects and guards are Commands, not declarative route nodes."]),
          h.li([], ["Hash fragments are retained by Url but not parsed by Route."]),
          h.li([], ["Rest routes capture at least one segment; their index route is separate."]),
          h.li([], ["Repeated query keys and lazy route modules are not official examples."]),
        ],
      ),
    ],
  );

const transitionLogView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.aside(
    [h.Class("rounded-[2rem] border border-[#d5d9ce] bg-white p-6")],
    [
      h.p(
        [h.Class("text-xs font-black uppercase tracking-[0.2em] text-[#52704f]")],
        ["Transition log"],
      ),
      h.ol(
        [h.Class("mt-4 space-y-3")],
        Array.map(model.transitionLog, (entry) =>
          h.li(
            [
              h.Class(
                "border-l-2 border-[#b8d8b4] pl-3 font-mono text-xs leading-5 text-[#596158]",
              ),
            ],
            [entry],
          ),
        ),
      ),
    ],
  );

const routingOverviewView = (h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("grid gap-5")],
    [
      routeDetailView(
        "Typed in both directions",
        "Every link above is built by the same parser that reads the destination URL. Invalid typed values cannot be passed to a builder.",
        [
          { label: "Root", value: homeRouter() },
          { label: "Routing root", value: routingHomeRouter() },
          { label: "Schema-built URL", value: productRouter({ productId: DEMO_PRODUCT_ID }) },
          {
            label: "Path + query URL",
            value: teamMemberRouter({ teamId: 7, memberId: 19, tab: Option.some("Activity") }),
          },
        ],
        h,
      ),
      boundariesView(h),
    ],
  );

const orderView = (orderId: number, h: HtmlBuilder<Message>): Html => {
  if (orderId === 404) {
    return routeDetailView(
      "Order not found",
      "The integer route matched successfully, but no resource exists. This is a resource-level 404.",
      [
        { label: "Parsed orderId", value: orderId.toString() },
        { label: "Route tag", value: "Order" },
      ],
      h,
    );
  } else {
    return routeDetailView(
      "Integer path parameter",
      "Route.int rejects non-integer segments before Model construction.",
      [
        { label: "Parsed orderId", value: orderId.toString() },
        { label: "Resource 404 demo", value: orderRouter({ orderId: 404 }) },
      ],
      h,
    );
  }
};

const filesIndexView = (h: HtmlBuilder<Message>): Html =>
  routeDetailView(
    "Rest-array index",
    "The index is an explicit route because rest requires at least one segment.",
    [
      { label: "Index", value: filesIndexRouter() },
      { label: "Captured path", value: filesRouter({ path: ["guides", "routing", "README.md"] }) },
    ],
    h,
  );

const vaultIndexView = (h: HtmlBuilder<Message>): Html =>
  routeDetailView(
    "Rest-string index",
    "The restString variant joins every captured segment into one slash-delimited value.",
    [
      { label: "Index", value: vaultIndexRouter() },
      { label: "Captured note", value: vaultNoteRouter({ path: "notes/routing/foldkit.md" }) },
    ],
    h,
  );

const guardedView = (h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("rounded-[2rem] bg-[#dcebd9] p-8")],
    [
      h.p(
        [h.Class("text-xs font-black uppercase tracking-[0.2em] text-[#28512d]")],
        ["Protected route"],
      ),
      h.h2(
        [h.Class("mt-3 text-3xl font-black text-[#172019]")],
        ["The Command guard allowed entry."],
      ),
      h.p(
        [h.Class("mt-3 max-w-2xl leading-7 text-[#496149]")],
        ["Sign out to replace this history entry with the sign-in route."],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(ClickedSignOut()),
          h.Class("mt-6 rounded-full bg-[#172019] px-5 py-3 font-bold text-white"),
        ],
        ["Sign out"],
      ),
    ],
  );

const signInView = (redirectTo: Option.Option<string>, h: HtmlBuilder<Message>): Html =>
  h.section(
    [h.Class("rounded-[2rem] bg-[#fff5df] p-8")],
    [
      h.p(
        [h.Class("text-xs font-black uppercase tracking-[0.2em] text-[#7c5524]")],
        ["Command redirect"],
      ),
      h.h2(
        [h.Class("mt-3 text-3xl font-black text-[#493419]")],
        ["Sign in to enter the guarded route."],
      ),
      h.p(
        [h.Class("mt-3 font-mono text-sm text-[#6a4d29]")],
        [`redirectTo: ${Option.getOrElse(redirectTo, () => guardedRouter())}`],
      ),
      h.button(
        [
          h.Type("button"),
          h.OnClick(ClickedSignIn()),
          h.Class("mt-6 rounded-full bg-[#f0a04b] px-5 py-3 font-bold text-[#172019]"),
        ],
        ["Sign in locally"],
      ),
    ],
  );

const routingContentView = (model: Model, h: HtmlBuilder<Message>): Html =>
  M.value(model.route).pipe(
    M.tags({
      RoutingHome: () => routingOverviewView(h),
      Static: () =>
        routeDetailView(
          "Static route",
          "A literal segment maps directly to a zero-payload Route variant.",
          [{ label: "Built URL", value: staticRouter() }],
          h,
        ),
      Deep: () =>
        routeDetailView(
          "Deep static path",
          "Multiple literal segments compose with slash. This is deep, not a nested layout.",
          [{ label: "Built URL", value: deepRouter() }],
          h,
        ),
      User: ({ slug }) =>
        routeDetailView(
          "String path parameter",
          "The slug segment is captured as a string and carried by the Route.",
          [
            { label: "slug", value: slug },
            { label: "Round trip", value: userRouter({ slug }) },
          ],
          h,
        ),
      Order: ({ orderId }) => orderView(orderId, h),
      Product: ({ productId }) =>
        routeDetailView(
          "Schema-refined path parameter",
          "Only UUID-shaped product IDs can construct this Route variant.",
          [
            { label: "productId", value: productId },
            { label: "Invalid URL falls to 404", value: "/examples/routing/products/banana" },
          ],
          h,
        ),
      TeamMember: ({ teamId, memberId, tab }) =>
        routeDetailView(
          "Multiple parameters plus query",
          "Two integer path parameters compose with an optional enum query parameter.",
          [
            { label: "teamId", value: teamId.toString() },
            { label: "memberId", value: memberId.toString() },
            { label: "tab", value: Option.getOrElse(tab, () => "None") },
          ],
          h,
        ),
      Search: ({ q, page, sort }) =>
        routeDetailView(
          "Typed optional query",
          "Schema decodes strings, finite numbers, and enum values. Missing values become Option.none.",
          [
            { label: "q", value: Option.getOrElse(q, () => "None") },
            {
              label: "page",
              value: Option.match(page, {
                onNone: () => "None",
                onSome: (value) => value.toString(),
              }),
            },
            { label: "sort", value: Option.getOrElse(sort, () => "None") },
            { label: "Invalid query demo", value: "/examples/routing/search?page=not-a-number" },
          ],
          h,
        ),
      Filter: ({ tags }) =>
        routeDetailView(
          "Custom query codec",
          "A Schema transform decodes one comma-separated query value into an array and encodes it back.",
          [
            {
              label: "tags",
              value: Option.match(tags, {
                onNone: () => "None",
                onSome: (values) => values.join(" · "),
              }),
            },
            { label: "Round trip", value: filterRouter({ tags }) },
          ],
          h,
        ),
      FilesIndex: () => filesIndexView(h),
      Files: ({ path }) =>
        routeDetailView(
          "Rest segment array",
          "Every remaining non-empty path segment is captured independently.",
          [
            { label: "segments", value: path.join(" → ") },
            { label: "Round trip", value: filesRouter({ path }) },
          ],
          h,
        ),
      VaultIndex: () => vaultIndexView(h),
      VaultNote: ({ path }) =>
        routeDetailView(
          "Rest segment string",
          "Every remaining segment is captured as one slash-delimited string.",
          [
            { label: "path", value: path },
            { label: "Round trip", value: vaultNoteRouter({ path }) },
          ],
          h,
        ),
      Guarded: () => guardedView(h),
      SignIn: ({ redirectTo }) => signInView(redirectTo, h),
    }),
    M.orElse(() => routingOverviewView(h)),
  );

const routingLabView = (model: Model, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(
        "Complete routing surface",
        "Foldkit Routing Lab",
        "Each control navigates to a real URL. Refresh anywhere, use browser history, and inspect how parsers, builders, Commands, and transitions agree.",
        h,
      ),
      routingNavigationView(model.route, h),
      h.div(
        [h.Class("mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]")],
        [
          h.div([h.Class("space-y-6")], [routingContentView(model, h), navigationControlsView(h)]),
          transitionLogView(model, h),
        ],
      ),
    ],
  );

const notFoundView = (path: string, h: HtmlBuilder<Message>): Html =>
  h.div(
    [],
    [
      pageHeaderView(
        "URL-level 404",
        "No parser consumed this complete path.",
        `The fallback captured “${path}”. This differs from a valid route whose resource is missing.`,
        h,
      ),
      h.div(
        [h.Class("flex flex-wrap gap-4")],
        [
          h.a(
            [
              h.Href(homeRouter()),
              h.Class("rounded-full bg-[#172019] px-5 py-3 font-bold text-white"),
            ],
            ["Go home"],
          ),
          h.a(
            [
              h.Href(exampleRouter({ slug: "missing-example" })),
              h.Class("rounded-full border border-[#7c8778] px-5 py-3 font-bold text-[#28512d]"),
            ],
            ["Compare resource 404"],
          ),
        ],
      ),
    ],
  );

const routeContentView = (model: Model, h: HtmlBuilder<Message>): Html =>
  M.value(model.route).pipe(
    M.tagsExhaustive({
      Home: () => homeView(h),
      ExamplesIndex: () => examplesIndexView(h),
      Example: ({ slug }) => exampleView(slug, model, h),
      RoutingHome: () => routingLabView(model, h),
      Static: () => routingLabView(model, h),
      Deep: () => routingLabView(model, h),
      User: () => routingLabView(model, h),
      Order: () => routingLabView(model, h),
      Product: () => routingLabView(model, h),
      TeamMember: () => routingLabView(model, h),
      Search: () => routingLabView(model, h),
      Filter: () => routingLabView(model, h),
      FilesIndex: () => routingLabView(model, h),
      Files: () => routingLabView(model, h),
      VaultIndex: () => routingLabView(model, h),
      VaultNote: () => routingLabView(model, h),
      Guarded: () => routingLabView(model, h),
      SignIn: () => routingLabView(model, h),
      ComponentsIndex: (filters) => ComponentDocs.indexView(filters, h),
      ComponentsParts: () =>
        ComponentDocs.indexView(
          {
            catalog: Option.some("parts"),
            phase: Option.none(),
            behaviorClass: Option.none(),
            status: Option.none(),
          },
          h,
        ),
      ComponentsStandalone: () =>
        ComponentDocs.indexView(
          {
            catalog: Option.some("standalone"),
            phase: Option.none(),
            behaviorClass: Option.none(),
            status: Option.none(),
          },
          h,
        ),
      ComponentPart: ({ slug }) => ComponentDocs.partView(slug, h),
      VisualProtocol: () => ComponentDocs.visualProtocolView(h),
      NotFound: ({ path }) => notFoundView(path, h),
    }),
  );

const activeExampleSlug = (route: AppRoute): Option.Option<string> => {
  if (route._tag === "Example") {
    return Option.some(route.slug);
  } else if (isRoutingRoute(route)) {
    return Option.some("routing");
  } else {
    return Option.none();
  }
};

const sidebarView = (route: AppRoute, h: HtmlBuilder<Message>): Html => {
  const maybeActiveSlug = activeExampleSlug(route);

  return h.aside(
    [
      h.Class(
        "max-h-64 overflow-y-auto border-b border-[#d9ddd3] bg-[#e8ebe3] lg:max-h-none lg:min-h-[calc(100vh-5rem)] lg:overflow-visible lg:border-r lg:border-b-0",
      ),
    ],
    [
      h.nav(
        [
          h.AriaLabel("Official examples"),
          h.Class("p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"),
        ],
        [
          h.a(
            [
              h.Href(examplesIndexRouter()),
              h.Class(
                "mb-3 block px-3 text-xs font-black uppercase tracking-[0.18em] text-[#657062]",
              ),
            ],
            ["Official examples"],
          ),
          h.ul(
            [h.Class("grid gap-1 sm:grid-cols-2 lg:grid-cols-1")],
            Array.map(examples, (example) => {
              const isActive = Option.contains(maybeActiveSlug, example.slug);
              const href =
                example.slug === "routing"
                  ? routingHomeRouter()
                  : exampleRouter({ slug: example.slug });

              return h.keyed("li")(
                example.slug,
                [],
                [
                  h.a(
                    [
                      h.Href(href),
                      ...(isActive ? [h.AriaCurrent("page")] : []),
                      h.Class(
                        `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold transition ${isActive ? "bg-[#28512d] text-white" : "text-[#4b574c] hover:bg-white"}`,
                      ),
                    ],
                    [
                      h.span([], [example.title]),
                      h.span([
                        h.Class(
                          `ml-3 h-2 w-2 rounded-full ${example.status === "Ready" ? "bg-[#f0a04b]" : "bg-[#b5bbb0]"}`,
                        ),
                        h.AriaHidden(true),
                      ]),
                    ],
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    ],
  );
};

const siteHeaderView = (route: AppRoute, h: HtmlBuilder<Message>): Html =>
  h.header(
    [h.Class("sticky top-0 z-20 border-b border-[#d9ddd3] bg-[#f3f5ef]/95 backdrop-blur")],
    [
      h.div(
        [h.Class("flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8")],
        [
          h.a(
            [
              h.Href(homeRouter()),
              h.Class("flex items-center gap-3 font-black tracking-tight text-[#172019]"),
            ],
            [
              h.span(
                [
                  h.Class(
                    "grid h-10 w-10 place-items-center rounded-2xl bg-[#172019] text-[#f0a04b]",
                  ),
                ],
                ["F"],
              ),
              h.span([h.Class("hidden sm:inline")], ["Foldkit Route Atlas"]),
            ],
          ),
          h.nav(
            [h.AriaLabel("Primary"), h.Class("flex items-center gap-2")],
            [
              h.a(
                [
                  h.Href(homeRouter()),
                  ...(route._tag === "Home" ? [h.AriaCurrent("page")] : []),
                  h.Class("rounded-full px-4 py-2 text-sm font-bold text-[#4b574c] hover:bg-white"),
                ],
                ["Home"],
              ),
              h.a(
                [
                  h.Href(examplesIndexRouter()),
                  ...(route._tag === "ExamplesIndex" ? [h.AriaCurrent("page")] : []),
                  h.Class("rounded-full bg-[#172019] px-4 py-2 text-sm font-bold text-white"),
                ],
                ["Examples"],
              ),
              h.a(
                [
                  h.Href(
                    componentsIndexRouter({
                      catalog: Option.none(),
                      phase: Option.none(),
                      behaviorClass: Option.none(),
                      status: Option.none(),
                    }),
                  ),
                  ...(isComponentRoute(route) ? [h.AriaCurrent("page")] : []),
                  h.Class("rounded-full px-4 py-2 text-sm font-bold text-[#4b574c] hover:bg-white"),
                ],
                ["Components"],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const routeTitle = (route: AppRoute): string => {
  if (route._tag === "Home") {
    return "Foldkit Route Atlas";
  } else if (route._tag === "ExamplesIndex") {
    return "Official Examples | Foldkit Route Atlas";
  } else if (route._tag === "Example") {
    return Option.match(findExample(route.slug), {
      onNone: () => "Example Not Found | Foldkit Route Atlas",
      onSome: (example) => `${example.title} | Foldkit Route Atlas`,
    });
  } else if (route._tag === "ComponentPart") {
    return `${route.slug} | Components | Foldkit Route Atlas`;
  } else if (isComponentRoute(route)) {
    return "Components | Foldkit Route Atlas";
  } else if (route._tag === "NotFound") {
    return "404 | Foldkit Route Atlas";
  } else {
    return "Routing Lab | Foldkit Route Atlas";
  }
};

export const view = (model: Model, h: HtmlBuilder<Message>): Document => ({
  title: routeTitle(model.route),
  body: h.div(
    [h.Class("min-h-screen")],
    [
      siteHeaderView(model.route, h),
      h.div(
        [h.Class("lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]")],
        [
          isComponentRoute(model.route)
            ? ComponentDocs.navigationView(h)
            : sidebarView(model.route, h),
          h.main([h.Class("min-w-0 px-5 py-10 sm:px-8 xl:px-12")], [routeContentView(model, h)]),
        ],
      ),
    ],
  ),
});

export const viewTransition: Runtime.ViewTransitionConfig<Model, Message> = ({
  model,
  message,
}) => {
  if (message._tag !== "ChangedUrl") {
    return false;
  } else if (model.route._tag === "ExamplesIndex") {
    return { types: ["to-example-index"] };
  } else if (isRoutingRoute(model.route)) {
    return { types: ["to-routing-detail"] };
  } else {
    return true;
  }
};
