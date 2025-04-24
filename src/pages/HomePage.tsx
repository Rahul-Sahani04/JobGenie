import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, Briefcase, User } from "lucide-react";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
// import SearchBar from '../components/common/SearchBar';
import Card from "../components/common/Card";

const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(
        location
      )}`
    );
  };

  const featuredJobs = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco",
      salary: "$120k - $150k",
      logo: "https://ui-avatars.com/api/?name=TC&background=3B82F6&color=ffffff&size=60",
    },
    {
      title: "Product Manager",
      company: "Innovate Inc",
      location: "New York",
      salary: "$110k - $140k",
      logo: "https://ui-avatars.com/api/?name=IN&background=14B8A6&color=ffffff&size=60",
    },
    {
      title: "Data Scientist",
      company: "Global Solutions",
      location: "Remote",
      salary: "$100k - $130k",
      logo: "https://ui-avatars.com/api/?name=GS&background=F97316&color=ffffff&size=60",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 z-0"></div>
        <div
          className="absolute inset-0 opacity-20 bg-[url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')]
          bg-cover bg-center bg-no-repeat"
        ></div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col items-center justify-center text-gray-900">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-3xl animate-fade-in">
            Find Your Dream Job Today
          </h1>

          <p className="mt-6 text-xl  text-center max-w-2xl animate-fade-in">
            Discover thousands of job opportunities with all the information you
            need. Find your dream job today!
          </p>

          <div className="w-full max-w-3xl mt-12 animate-slide-up">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg shadow-lg overflow-hidden p-1"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                  <Search className="text-gray-400 mr-2" size={20} />
                  <input
                    type="text"
                    className="w-full py-2 outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Job title or keyword"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="flex-1 flex items-center px-4 py-2">
                  <MapPin className="text-gray-400 mr-2" size={20} />
                  <input
                    type="text"
                    className="w-full py-2 outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="m-0 rounded-md md:rounded-none md:rounded-r-lg"
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2  opacity-80">
              <span className="text-sm">Popular searches:</span>
              <a
                href="/jobs?query=React"
                className="text-sm underline underline-offset-2"
              >
                React
              </a>
              <a
                href="/jobs?query=Software%20Engineer"
                className="text-sm underline underline-offset-2"
              >
                Software Engineer
              </a>
              <a
                href="/jobs?query=Product%20Manager"
                className="text-sm underline underline-offset-2"
              >
                Product Manager
              </a>
              <a
                href="/jobs?query=Data%20Scientist"
                className="text-sm underline underline-offset-2"
              >
                Data Scientist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Featured Jobs
            </h2>
            <a
              href="/jobs"
              className="text-primary-600 font-medium flex items-center hover:text-primary-700"
            >
              View all jobs
              <ArrowRight size={16} className="ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <Card key={index} hover className="h-full transition-all">
                <div className="flex items-start">
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 rounded mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 mt-1">{job.company}</p>

                    <div className="flex items-center text-gray-500 mt-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{job.location}</span>
                    </div>

                    <div className="mt-3">
                      <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Explore Job Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Technology", icon: "💻", count: 1200 },
              { name: "Marketing", icon: "📊", count: 840 },
              { name: "Design", icon: "🎨", count: 753 },
              { name: "Finance", icon: "💰", count: 621 },
              { name: "Healthcare", icon: "🏥", count: 932 },
              { name: "Education", icon: "🎓", count: 566 },
              { name: "Customer Service", icon: "🛎️", count: 375 },
              { name: "Human Resources", icon: "👥", count: 284 },
            ].map((category) => (
              <a
                key={category.name}
                href={`/jobs?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all p-6 flex flex-col items-center text-center"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.count} jobs
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            How JobGenie Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Account",
                description:
                  "Sign up for free and set up your profile with your skills and preferences.",
                icon: <User className="h-10 w-10 text-primary-600" />,
              },
              {
                title: "Find Jobs",
                description:
                  "Search and filter through thousands of jobs to find the perfect match for you.",
                icon: <Search className="h-10 w-10 text-primary-600" />,
              },
              {
                title: "Apply with Ease",
                description:
                  "Submit your application directly through our platform with just a few clicks.",
                icon: <Briefcase className="h-10 w-10 text-primary-600" />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/register"
              className="inline-blockN bg-primary-600  text-lg font-medium py-3 px-6 rounded-lg hover:bg-primary-700 transition"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 ">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Find Your Dream Job?
          </h2>

          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who've found their dream jobs using
            JobGenie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <Button variant="secondary" size="lg">
                Create an Account
              </Button>
            </a>
            <a
              href="/jobs"
              className=" border-white hover:bg-white hover:text-primary-700"
            >
              <Button variant="outline" size="lg">
                Browse Jobs
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
