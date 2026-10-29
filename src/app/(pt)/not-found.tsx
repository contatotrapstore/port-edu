import NotFoundView from "../_root/not-found-view";

// notFound() nas rotas em português sai dentro do layout raiz (pt), com lang="pt-BR".
export default function NotFound() {
  return <NotFoundView languages={["pt-BR"]} />;
}
