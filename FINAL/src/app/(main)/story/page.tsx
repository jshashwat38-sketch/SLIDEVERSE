export default function StoryPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-12">
      <h1 className="text-5xl font-bold text-gray-900 mb-10 tracking-tight">Our Story</h1>
      
      <div className="bg-blue-50 text-gray-900 p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12 relative overflow-hidden border border-blue-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full blur-3xl -z-10" />
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Born from a simple need.</h2>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          In 2023, our founders were frustrated by the lack of high-quality, professional presentation templates that didn't look like they were built in 1995. They decided to change that.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">The Problem</h3>
          <p className="text-gray-600 leading-relaxed">
            Professionals spend countless hours tinkering with slide layouts instead of focusing on their core message. The tools available were either too complex or produced amateurish results.
          </p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">The Solution</h3>
          <p className="text-gray-600 leading-relaxed">
            Slideverse was created to provide a curated marketplace of premium, ready-to-use templates that command authority and respect in any boardroom.
          </p>
        </div>
      </div>
    </div>
  );
}
