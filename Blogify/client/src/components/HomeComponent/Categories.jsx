import React from "react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Technology",
      icon: "💻",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      count: 42,
    },
    {
      id: 2,
      name: "Health & Wellness",
      icon: "🧘",
      color: "bg-green-100",
      textColor: "text-green-700",
      count: 38,
    },
    {
      id: 3,
      name: "Business",
      icon: "📊",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      count: 35,
    },
    {
      id: 4,
      name: "Travel",
      icon: "✈️",
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      count: 27,
    },
    {
      id: 5,
      name: "Food",
      icon: "🍳",
      color: "bg-red-100",
      textColor: "text-red-700",
      count: 24,
    },
    {
      id: 6,
      name: "Lifestyle",
      icon: "🏡",
      color: "bg-indigo-100",
      textColor: "text-indigo-700",
      count: 19,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover content that matters to you. Browse articles across various
            topics and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.name
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/\s+/g, "-")}`}
              className={`${category.color} ${category.textColor} rounded-lg p-6 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md`}
            >
              <span className="text-4xl mr-4">{category.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p>{category.count} articles</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
