import Link from "next/link";
import { ArrowRight, Users, BookOpen, Star, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-sky-100 text-sky-800 rounded-full text-sm font-medium mb-4">
              🚀 Join 10,000+ skill swappers worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Skills Come <span className="text-sky-600">Full Circle</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Connect with people who want to teach skills they know in exchange
            for learning skills they need. Our modern barter platform makes
            skill exchange simple, safe, and rewarding.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/sign-in"
              className="group px-8 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 border-2 border-sky-600 text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors"
            >
              Browse Skills
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-16">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>50+ Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Skill Swap Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start exchanging skills and growing your expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                1. Connect
              </h3>
              <p className="text-gray-600 text-center">
                Find people with complementary skills in your area or online.
                Browse profiles and discover amazing learning opportunities.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                2. Exchange
              </h3>
              <p className="text-gray-600 text-center">
                Trade your expertise for new skills through our secure barter system.
                Set your own schedule and learning pace.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                3. Grow
              </h3>
              <p className="text-gray-600 text-center">
                Build your skills, expand your network, and track your progress.
                Rate experiences and build your reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Skills to Learn & Teach
              </h2>
              <p className="text-lg text-gray-600">
                Discover the most in-demand skills on our platform
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Web Development", "Graphic Design", "Photography", "Language Learning",
                "Music Production", "Digital Marketing", "Data Analysis", "Cooking",
                "Writing", "Video Editing", "Public Speaking", "Yoga"
              ].map((skill) => (
                <div
                  key={skill}
                  className="bg-gray-50 hover:bg-sky-50 rounded-lg p-4 text-center transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-sky-600">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium"
              >
                View all skills
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-sky-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-sky-100">Active Users</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">25K+</div>
                <div className="text-sky-100">Skills Exchanged</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-sky-100">Countries</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.9</div>
                <div className="text-sky-100">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Community Says
              </h2>
              <p className="text-lg text-gray-600">
                Real stories from real skill swappers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;I learned Spanish from Maria while teaching her web development.
                  It&rsquo;s amazing how much we both grew from this exchange!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sky-600 font-semibold">AS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Amit Sharma</div>
                    <div className="text-sm text-gray-500">Web Developer</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;The platform is so easy to use. I&rsquo;ve connected with amazing people
                  and learned photography while sharing my cooking skills.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sky-600 font-semibold">PP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Priya Patel</div>
                    <div className="text-sm text-gray-500">Chef</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &ldquo;Skill Swap changed my life. I&rsquo;ve built an amazing network of
                  creative professionals and learned so many new skills.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sky-600 font-semibold">RV</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Rahul Verma</div>
                    <div className="text-sm text-gray-500">Designer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and teachers who are already growing
              their skills through meaningful exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-in"
                className="group px-8 py-4 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Join Skill Swap Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/search"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-sky-600 transition-colors"
              >
                Explore Skills
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
