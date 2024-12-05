// mock book data
const books = [
    { 
      id: 1, 
      title: "How To Win Friends and Influence People", 
      description: "Timeless guide offering proven techniques for effective communication, building strong relationships, and positively influencing others in both personal and professional settings.", 
      pdfLink: "https://storage.googleapis.com/adam-testing-iv-storage/books/How%20To%20Win%20Friends%20and%20Influence%20People.pdf",
      image: "https://storage.googleapis.com/adam-testing-iv-storage/books/img/how%20to%20win%20friends.jpg", 
    },
    { 
      id: 2, 
      title: "Rich Dad Poor Dad", 
      description: "Insightful personal finance book contrasting different money mindsets, teaching financial literacy, investment strategies, and wealth-building principles for lasting financial success.", 
      pdfLink: "https://storage.googleapis.com/adam-testing-iv-storage/books/Rich%20Dad%20Poor%20Dad%20.pdf",
      image: "https://storage.googleapis.com/adam-testing-iv-storage/books/img/rich-dad-poor-dad.jpg"
    },
    { 
      id: 3, 
      title: "The 4-Hour Workweek", 
      description: "Practical guide to escaping the 9-5, increasing productivity, and designing a flexible, fulfilling lifestyle through automation and smart work strategies.", 
      pdfLink: "https://storage.googleapis.com/adam-testing-iv-storage/books/The%204-Hour%20Workweek%2C%20Expanded%20and%20Updated_%20Expanded%20and%20Updated%2C%20With%20Over%20100%20New%20Pages%20of%20Cutting-Edge%20Content.pdf",
      image: "https://storage.googleapis.com/adam-testing-iv-storage/books/img/the%204%20hr%20work%20week.jpg"
    },
    { 
      id: 4, 
      title: "The Power of Habit: Why We Do What We Do in Life and Business", 
      description: "Explores the science of habits, revealing how they shape our lives and businesses, and offers strategies to transform behaviors for success.", 
      pdfLink: "https://storage.googleapis.com/adam-testing-iv-storage/books/The%20Power%20of%20Habit_%20Why%20We%20Do%20What%20We%20Do%20in%20Life%20and%20Business.pdf",
      image: "https://storage.googleapis.com/adam-testing-iv-storage/books/img/the%20power%20of%20habit.webp"
    },
    { 
      id: 5, 
      title: "Thinking, Fast and Slow", 
      description: "Explores the two systems of thought—fast, intuitive and slow, rational—revealing how they shape our decisions and behavior.", 
      pdfLink: "https://storage.googleapis.com/adam-testing-iv-storage/books/Thinking%2C%20Fast%20and%20Slow.pdf",
      image: "https://storage.googleapis.com/adam-testing-iv-storage/books/img/thinking%20fast%20and%20slow.jpeg"
    },
  ];
  
  // get book list
  const getAllBooks = (role) => {
    return books;
  };
  
  // get book by id
  const getBookById = (id) => {
    return books.find((book) => book.id === id);
  };
  
  module.exports = { getAllBooks, getBookById };
  