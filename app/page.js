'use client';
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/workspace');
    } else {
      router.push('/sign-in?redirect_url=/workspace');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/95 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent">
            <Image src="/logo.svg" alt="Logo" width={130} height={120} />
          </div>
          <ul className="hidden md:flex gap-8 items-center">
            <li>
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Features
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                How It Works
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Testimonials
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-purple-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-full px-6"
            >
              Get Started
            </Button>
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <Image 
          src="/hero-img.webp" 
          alt="Hero Background" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-600/80" />
        <div className="text-center text-white z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-[fadeInUp_1s_ease-out]">
            Unlock Your Potential with Apprendre – AI-Powered Learning Platform 🚀
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-[fadeInUp_1s_ease-out_0.2s_backwards]">
            Experience personalized education that adapts to your unique learning style and pace
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-semibold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Start Learning Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
          Powerful Features
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎯",
              title: "Personalized Learning",
              description: "Tailored learning paths based on your progress and goals."
            },
            {
              icon: "⚡",
              title: "Instant Feedback",
              description: "Receive immediate feedback on your assignments and quizzes."
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Comprehensive analytics to monitor your learning journey."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-purple-600">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
          How It Works
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              number: "1",
              title: "Sign Up",
              description: "Create your free account in minutes."
            },
            {
              number: "2",
              title: "Choose Your Path",
              description: "Browse through our vast library of AI-powered courses."
            },
            {
              number: "3",
              title: "Start Learning",
              description: "Begin your personalized learning journey today!"
            }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-br from-purple-600 to-purple-900 text-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          What Our Learners Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              text: "The AI-powered feedback has been a game-changer for my learning. It's like having a personal tutor!",
              avatar: "👨",
              name: "John Doe",
              role: "Student"
            },
            {
              text: "Integrating AI into my teaching has never been easier. The platform is intuitive and powerful.",
              avatar: "👩",
              name: "Jane Smith",
              role: "Educator"
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
            >
              <p className="text-lg italic mb-6">{testimonial.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-sm opacity-80">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of learners achieving their goals with our AI platform.
        </p>
        <Button 
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-purple-600 to-purple-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg px-8 py-6 rounded-full"
        >
          Get Started Free
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>&copy; 2025 Apprendre Learning Platform. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}