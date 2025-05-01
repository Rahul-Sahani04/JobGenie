import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, Briefcase, User } from "lucide-react";
import Layout from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { Separator } from "../components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

import { HoverEffect } from "@/components/ui/card-hover-effect";

const HomePage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const categories = [
    { name: "Technology", icon: "💻", count: 1200 },
    { name: "Marketing", icon: "📊", count: 840 },
    { name: "Design", icon: "🎨", count: 753 },
    { name: "Finance", icon: "💰", count: 621 },
    { name: "Healthcare", icon: "🏥", count: 932 },
    { name: "Education", icon: "🎓", count: 566 },
    { name: "Customer Service", icon: "🛎️", count: 375 },
    { name: "Human Resources", icon: "👥", count: 284 },
  ];

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
      company: "TechCorp India",
      location: "Bengaluru",
      salary: "₹12L - ₹15L",
      logo: "https://ui-avatars.com/api/?name=TC&background=3B82F6&color=ffffff&size=60",
    },
    {
      title: "Product Manager",
      company: "Innovate India",
      location: "Mumbai",
      salary: "₹11L - ₹14L",
      logo: "https://ui-avatars.com/api/?name=IN&background=14B8A6&color=ffffff&size=60",
    },
    {
      title: "Data Scientist",
      company: "Global Solutions India",
      location: "Remote",
      salary: "₹10L - ₹13L",
      logo: "https://ui-avatars.com/api/?name=GS&background=F97316&color=ffffff&size=60",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative  min-h-[80vh] pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 z-0"></div>
        <div
          className="absolute inset-0 opacity-40 bg-[url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920')]
          bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute inset-0 bg-black opacity-30 "></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col items-center justify-center text-gray-900">
          <TextGenerateEffect
            words="Find Your Dream Job Today"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-3xl animate-fade-in"
          />

          <p className="mt-6 text-xl  text-center max-w-2xl animate-fade-in">
            Discover thousands of job opportunities with all the information you
            need. Find your dream job today!
          </p>

          <div className="w-full max-w-3xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-lg shadow-lg overflow-hidden p-2 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex md:flex-row gap-2   justify-center items-center">
                <div className="flex space-x-2 w-full">
                  <div className="relative w-full">
                    <Search
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="text"
                      className="pl-10 h-12 transition-colors duration-200"
                      placeholder="Job title or keyword"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full">
                    <MapPin
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="text"
                      className="pl-10 h-12 transition-colors duration-200"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 md:w-auto bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                >
                  Search Jobs
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
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="flex items-start p-4">
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-14 h-14 rounded-lg mr-4 shadow-sm"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors duration-200">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                        <div className="flex items-center text-gray-500 mt-2">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="mt-3">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {job.salary}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-500">at {job.company}</p>
                    <Separator />
                    <div className="text-sm">
                      <p>💰 Salary: {job.salary}</p>
                      <p>📍 Location: {job.location}</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
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
            {categories.map((category) => (
              // <Card key={category.name} className="group overflow-hidden">
              <MagicCard>
                <a
                  href={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="block p-6 transition-all duration-300 transform hover:scale-[1.02] hover:bg-primary/5"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110">
                      {category.icon}
                    </span>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.count.toLocaleString()} jobs
                    </p>
                  </div>
                </a>
              </MagicCard>
              // </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              How JobGenie Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your journey to finding the perfect job made simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Account",
                description:
                  "Sign up for free and set up your profile with your skills and preferences.",
                icon: <User className="h-10 w-10 text-primary" />,
              },
              {
                title: "Find Jobs",
                description:
                  "Search and filter through thousands of jobs to find the perfect match for you.",
                icon: <Search className="h-10 w-10 text-primary" />,
              },
              {
                title: "Apply with Ease",
                description:
                  "Submit your application directly through our platform with just a few clicks.",
                icon: <Briefcase className="h-10 w-10 text-primary" />,
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6 text-center">
                  <div className="mb-6">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-white shadow-md flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="default"
              className="bg-primary hover:bg-primary/90"
            >
              <a href="/register">Get Started Today</a>
            </Button>
          </div>
        </div>
      </section>

      <hr />

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600 to-primary-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary-200 to-transparent duration-300" />
        <div className="container relative mx-auto px-6 text-center text-black">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream Job?
            </h2>

            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join thousands of professionals who've found their dream jobs
              using JobGenie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center !text-black">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-primary-700 hover:bg-[#965FFF]/80 hover:text-white"
              >
                <a href="/register">Create an Account</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white hover:bg-[#965FFF]/80 hover:text-white"
              >
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
