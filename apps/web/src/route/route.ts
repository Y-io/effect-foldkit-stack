import { Schema as S, SchemaGetter, pipe } from "effect";
import { Route } from "foldkit";
import { int, literal, r, rest, restString, schemaSegment, slash, string } from "foldkit/route";

const PRODUCT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const ProductId = S.String.check(S.isPattern(PRODUCT_ID_PATTERN)).pipe(S.brand("ProductId"));
export type ProductId = typeof ProductId.Type;

const CsvTags = S.String.pipe(
  S.decodeTo(S.Array(S.String), {
    decode: SchemaGetter.transform((input) => input.split(",").filter((tag) => tag.length > 0)),
    encode: SchemaGetter.transform((tags) => tags.join(",")),
  }),
);

export const HomeRoute = r("Home");
export const ExamplesIndexRoute = r("ExamplesIndex");
export const ExampleRoute = r("Example", { slug: S.String });
export const RoutingHomeRoute = r("RoutingHome");
export const StaticRoute = r("Static");
export const DeepRoute = r("Deep");
export const UserRoute = r("User", { slug: S.String });
export const OrderRoute = r("Order", { orderId: S.Finite });
export const ProductRoute = r("Product", { productId: ProductId });
export const TeamMemberRoute = r("TeamMember", {
  teamId: S.Finite,
  memberId: S.Finite,
  tab: S.Option(S.Literals(["Overview", "Activity"])),
});
export const SearchRoute = r("Search", {
  q: S.Option(S.String),
  page: S.Option(S.Finite),
  sort: S.Option(S.Literals(["Asc", "Desc"])),
});
export const FilterRoute = r("Filter", { tags: S.Option(S.Array(S.String)) });
export const FilesIndexRoute = r("FilesIndex");
export const FilesRoute = r("Files", { path: S.NonEmptyArray(S.String) });
export const VaultIndexRoute = r("VaultIndex");
export const VaultNoteRoute = r("VaultNote", { path: S.String });
export const GuardedRoute = r("Guarded");
export const SignInRoute = r("SignIn", { redirectTo: S.Option(S.String) });
export const NotFoundRoute = r("NotFound", { path: S.String });

export const AppRoute = S.Union([
  HomeRoute,
  ExamplesIndexRoute,
  ExampleRoute,
  RoutingHomeRoute,
  StaticRoute,
  DeepRoute,
  UserRoute,
  OrderRoute,
  ProductRoute,
  TeamMemberRoute,
  SearchRoute,
  FilterRoute,
  FilesIndexRoute,
  FilesRoute,
  VaultIndexRoute,
  VaultNoteRoute,
  GuardedRoute,
  SignInRoute,
  NotFoundRoute,
]);
export type AppRoute = typeof AppRoute.Type;

export const homeRouter = pipe(Route.root, Route.mapTo(HomeRoute));

export const examplesIndexRouter = pipe(literal("examples"), Route.mapTo(ExamplesIndexRoute));

export const routingHomeRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  Route.mapTo(RoutingHomeRoute),
);

export const staticRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("static")),
  Route.mapTo(StaticRoute),
);

export const deepRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("deep")),
  slash(literal("route")),
  slash(literal("is")),
  slash(literal("nested")),
  Route.mapTo(DeepRoute),
);

export const userRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("users")),
  slash(string("slug")),
  Route.mapTo(UserRoute),
);

export const orderRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("orders")),
  slash(int("orderId")),
  Route.mapTo(OrderRoute),
);

export const productRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("products")),
  slash(schemaSegment("productId", ProductId)),
  Route.mapTo(ProductRoute),
);

export const teamMemberRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("teams")),
  slash(int("teamId")),
  slash(literal("members")),
  slash(int("memberId")),
  Route.query(
    S.Struct({
      tab: S.OptionFromOptional(S.Literals(["Overview", "Activity"])),
    }),
  ),
  Route.mapTo(TeamMemberRoute),
);

export const searchRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("search")),
  Route.query(
    S.Struct({
      q: S.OptionFromOptional(S.String),
      page: S.OptionFromOptional(S.FiniteFromString),
      sort: S.OptionFromOptional(S.Literals(["Asc", "Desc"])),
    }),
  ),
  Route.mapTo(SearchRoute),
);

export const filterRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("filter")),
  Route.query(S.Struct({ tags: S.OptionFromOptional(CsvTags) })),
  Route.mapTo(FilterRoute),
);

export const filesIndexRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("files")),
  Route.mapTo(FilesIndexRoute),
);

export const filesRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("files")),
  slash(rest("path")),
  Route.mapTo(FilesRoute),
);

export const vaultIndexRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("vault")),
  Route.mapTo(VaultIndexRoute),
);

export const vaultNoteRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("vault")),
  slash(restString("path")),
  Route.mapTo(VaultNoteRoute),
);

export const guardedRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("guarded")),
  Route.mapTo(GuardedRoute),
);

export const signInRouter = pipe(
  literal("examples"),
  slash(literal("routing")),
  slash(literal("sign-in")),
  Route.query(S.Struct({ redirectTo: S.OptionFromOptional(S.String) })),
  Route.mapTo(SignInRoute),
);

export const exampleRouter = pipe(
  literal("examples"),
  slash(string("slug")),
  Route.mapTo(ExampleRoute),
);

const routeParser = Route.oneOf(
  deepRouter,
  teamMemberRouter,
  productRouter,
  orderRouter,
  userRouter,
  searchRouter,
  filterRouter,
  filesIndexRouter,
  filesRouter,
  vaultIndexRouter,
  vaultNoteRouter,
  guardedRouter,
  signInRouter,
  staticRouter,
  routingHomeRouter,
  exampleRouter,
  examplesIndexRouter,
  homeRouter,
);

export const urlToAppRoute = Route.parseUrlWithFallback(routeParser, NotFoundRoute);
