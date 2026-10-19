import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function About({ content }) {
  return (
    <section id="about" className="container-page py-16">
      <h2 className="section-title">关于我</h2>
      <div className="mt-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: (props) => <a {...props} className="text-brand-500 underline-offset-4 hover:underline" target="_blank" rel="noreferrer" />,
          }}
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold
                     prose-a:text-brand-500 prose-strong:text-slate-900 dark:prose-strong:text-white"
        >
          {content}
        </ReactMarkdown>
      </div>
    </section>
  )
}
