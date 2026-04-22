// src/app/(main)/about/page.tsx
export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8">About Slideverse</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 prose prose-lg max-w-none text-gray-600">
        <p className="lead text-xl text-gray-800 font-medium mb-6">
          Welcome to the world's premier destination for professional presentation templates.
        </p>
        <p className="mb-4">
          At Slideverse, we believe that every great idea deserves an incredible presentation. We are dedicated to providing professionals, educators, and entrepreneurs with the highest quality digital assets to make their messages stand out.
        </p>
        <p>
          Whether you are delivering a keynote speech, pitching to investors, or running a team meeting, our meticulously crafted templates ensure you command authority and engage your audience.
        </p>
      </div>
    </div>
  );
}
