import { Match as M, Schema as S } from "effect";
import { Command, Submodel } from "foldkit";
import { m } from "foldkit/message";
import { evo } from "foldkit/struct";

export const Model = S.Struct({ count: S.Finite });
export type Model = typeof Model.Type;

export const ClickedDecrement = m("ClickedDecrement");
export const ClickedIncrement = m("ClickedIncrement");
export const ClickedReset = m("ClickedReset");

export const Message = S.Union([ClickedDecrement, ClickedIncrement, ClickedReset]);
export type Message = typeof Message.Type;

export const init = (): Model => Model.make({ count: 0 });

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<readonly [Model, ReadonlyArray<Command.Command<Message>>]>(),
    M.tagsExhaustive({
      ClickedDecrement: () => [evo(model, { count: (count) => count - 1 }), []],
      ClickedIncrement: () => [evo(model, { count: (count) => count + 1 }), []],
      ClickedReset: () => [evo(model, { count: () => 0 }), []],
    }),
  );

export const view = Submodel.defineView<Model, Message>((model, h) =>
  h.section(
    [h.AriaLabel("Counter example"), h.Class("rounded-[2rem] bg-[#172019] p-8 text-white")],
    [
      h.p(
        [h.Class("text-sm font-semibold uppercase tracking-[0.2em] text-[#b8d8b4]")],
        ["Live official example"],
      ),
      h.p([h.Class("mt-5 text-7xl font-black tabular-nums")], [model.count.toString()]),
      h.div(
        [h.Class("mt-8 flex flex-wrap gap-3")],
        [
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedDecrement()),
              h.AriaLabel("Decrement count"),
              h.Class(
                "rounded-full bg-white px-5 py-3 font-bold text-[#172019] hover:bg-[#dcebd9]",
              ),
            ],
            ["−"],
          ),
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedReset()),
              h.Class("rounded-full border border-white/40 px-5 py-3 font-bold hover:bg-white/10"),
            ],
            ["Reset"],
          ),
          h.button(
            [
              h.Type("button"),
              h.OnClick(ClickedIncrement()),
              h.AriaLabel("Increment count"),
              h.Class(
                "rounded-full bg-[#f0a04b] px-5 py-3 font-bold text-[#172019] hover:bg-[#ffc06d]",
              ),
            ],
            ["+"],
          ),
        ],
      ),
    ],
  ),
);
