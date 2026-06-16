export default function ArticleBody({ html }: { html: string }) {
  return (
    <div
      className="container-x mt-12 md:mt-16 prose-yur"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
