import { Option } from "effect";
import { fromString } from "foldkit/url";
import { describe, expect, test } from "vitest";

import {
  ComponentsIndexRoute,
  ProductId,
  deepRouter,
  exampleRouter,
  filesIndexRouter,
  filesRouter,
  filterRouter,
  productRouter,
  routingHomeRouter,
  searchRouter,
  teamMemberRouter,
  urlToAppRoute,
  vaultIndexRouter,
  vaultNoteRouter,
} from "./route";

const urlOrThrow = (raw: string) =>
  Option.getOrThrowWith(fromString(raw), () => new Error(`Failed to parse URL: ${raw}`));

const parse = (path: string) => urlToAppRoute(urlOrThrow(`http://localhost${path}`));

describe("route parser", () => {
  test("gives the routing root priority over the generic example route", () => {
    expect(parse("/examples/routing")._tag).toBe("RoutingHome");
    expect(routingHomeRouter()).toBe("/examples/routing");
  });

  test("round-trips static, deep, and generic example routes", () => {
    expect(parse(deepRouter())._tag).toBe("Deep");

    const exampleRoute = parse(exampleRouter({ slug: "counter" }));
    expect(exampleRoute).toStrictEqual({ _tag: "Example", slug: "counter" });
  });

  test("parses multiple path parameters and an optional enum query", () => {
    const path = teamMemberRouter({
      teamId: 7,
      memberId: 19,
      tab: Option.some("Activity"),
    });

    expect(path).toBe("/examples/routing/teams/7/members/19?tab=Activity");
    expect(parse(path)).toStrictEqual({
      _tag: "TeamMember",
      teamId: 7,
      memberId: 19,
      tab: Option.some("Activity"),
    });
  });

  test("rejects a path parameter that fails its Schema refinement", () => {
    expect(parse("/examples/routing/products/banana")).toStrictEqual({
      _tag: "NotFound",
      path: "/examples/routing/products/banana",
    });

    const productId = ProductId.make("3f2504e0-4f89-41d3-9a0c-0305e82c3301");
    expect(parse(productRouter({ productId }))).toStrictEqual({
      _tag: "Product",
      productId,
    });
  });

  test("decodes typed optional query parameters", () => {
    expect(parse("/examples/routing/search?q=foldkit&page=2&sort=Desc")).toStrictEqual({
      _tag: "Search",
      q: Option.some("foldkit"),
      page: Option.some(2),
      sort: Option.some("Desc"),
    });

    expect(
      parse(
        searchRouter({
          q: Option.none(),
          page: Option.none(),
          sort: Option.none(),
        }),
      ),
    ).toStrictEqual({
      _tag: "Search",
      q: Option.none(),
      page: Option.none(),
      sort: Option.none(),
    });

    expect(parse("/examples/routing/search?page=not-a-number")._tag).toBe("NotFound");
  });

  test("round-trips a custom comma-separated query codec", () => {
    const path = filterRouter({ tags: Option.some(["effect", "routing"]) });

    expect(path).toBe("/examples/routing/filter?tags=effect%2Crouting");
    expect(parse(path)).toStrictEqual({
      _tag: "Filter",
      tags: Option.some(["effect", "routing"]),
    });
  });

  test("keeps rest-array and rest-string index routes separate", () => {
    expect(parse(filesIndexRouter())._tag).toBe("FilesIndex");
    expect(parse(filesRouter({ path: ["guides", "routing"] }))).toStrictEqual({
      _tag: "Files",
      path: ["guides", "routing"],
    });
    expect(parse(vaultIndexRouter())._tag).toBe("VaultIndex");
    expect(parse(vaultNoteRouter({ path: "notes/foldkit.md" }))).toStrictEqual({
      _tag: "VaultNote",
      path: "notes/foldkit.md",
    });
  });

  test("distinguishes a valid example-shaped URL from an unmatched URL", () => {
    expect(parse("/examples/missing-example")).toStrictEqual({
      _tag: "Example",
      slug: "missing-example",
    });
    expect(parse("/does-not-exist")).toStrictEqual({
      _tag: "NotFound",
      path: "/does-not-exist",
    });
  });

  test("parses component documentation filters within their published value ranges", () => {
    expect(
      parse("/components?catalog=parts&phase=1&behaviorClass=A&status=verified"),
    ).toStrictEqual(
      ComponentsIndexRoute({
        catalog: Option.some("parts"),
        phase: Option.some(1),
        behaviorClass: Option.some("A"),
        status: Option.some("verified"),
      }),
    );
    expect(parse("/components?phase=8")._tag).toBe("NotFound");
    expect(parse("/components?catalog=Parts")._tag).toBe("NotFound");
  });
});
