import NotFoundView from "../_root/not-found-view";

// notFound() nas rotas /en/* sai dentro do layout raiz (en), com lang="en".
export default function NotFound() {
  return <NotFoundView languages={["en"]} />;
}
