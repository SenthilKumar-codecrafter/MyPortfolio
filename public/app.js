// Import Angular
/// <reference path="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js" />

// Angular Application
const app = angular.module("portfolioApp", [])

app.controller("MainController", ($scope) => {
  // Mobile menu toggle
  $scope.mobileMenuOpen = false
  $scope.toggleMenu = () => {
    $scope.mobileMenuOpen = !$scope.mobileMenuOpen
  }

  // Current year for footer
  $scope.currentYear = new Date().getFullYear()

  // Skills data
  $scope.skillCategories = ["All", "Frontend", "Backend", "Database", "Tools"]
  $scope.selectedCategory = "All"

  $scope.skills = [
    {
      name: "HTML5",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    },
    {
      name: "CSS3",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    },
    {
      name: "JavaScript",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
    {
      name: "Angular",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    },

    {
      name: "Tailwind CSS",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    },
    {
      name: "Bootstrap",
      category: "Frontend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    },
    {
      name: "Node.js",
      category: "Backend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
  
    {
      name: "Java",
      category: "Backend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    },
    {
      name: ".NET",
      category: "Tools",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg"
    },    
    {
      name: "Python",
      category: "Backend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    },
    {
      name: "Oracle SQL",
      category: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg"
    },
    {
      name: "MS SQL Server",
      category: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg"
    },
    {
      name: "MySQL",
      category: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      name: "VS Code",
      category: "Tools",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    },
    {
      name: "Eclipse",
      category: "Tools",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg"
    },
    {
      name: "Visual Studio",
      category: "Tools",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg"
    },    
    {
      name: "Spring Boot",
      category: "Backend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original-wordmark.svg"
    },
    {
      name: "JDBC",
      category: "Backend",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
    },

    
    
    

  ]

  $scope.filteredSkills = $scope.skills

  $scope.filterSkills = (category) => {
    $scope.selectedCategory = category
    if (category === "All") {
      $scope.filteredSkills = $scope.skills
    } else {
      $scope.filteredSkills = $scope.skills.filter((skill) => skill.category === category)
    }
  }

  // Projects data
  $scope.projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with product management, cart, and payment integration.",
      image: "./public/images/showing-cart-trolley-shopping-online-sign-graphic.jpg",
      technologies: ["Angular", "Node.js", "Express", "MongoDB"],
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates and team features.",
      image: "./public/images/4004529.jpg",
      technologies: ["Angular", "TypeScript", "Firebase", "Tailwind CSS"],
      liveUrl: "#",
      codeUrl: "#",
    },
    {
      title: "Weather Dashboard",
      description: "A weather application that displays current and forecasted weather data for any location.",
      image: "./public/images/4196428.jpg",
      technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
      liveUrl: "#",
      codeUrl: "#",
    },
  ]

  // Experience data
  $scope.experience = [
    {
      title: ".NET Developer",
      company: "Focuslogic IT Services",
      period: "02-OCT-2024 - Present",
      description: "Working as a .NET Developer, contributing to various projects with a focus on UI, localization, responsiveness, and more.",
      responsibilities: [
        "Contributed to the development of the company website using HTML, CSS, and JavaScript with a focus on responsive design",
        "Developed and implemented UI components using Fluent UI in Blazor for the 'Simply Fresh' project",
        "Full contribution to the UI development for the 'OETC' project, utilizing Fluent UI, HTML, CSS, and JavaScript",
        "Worked on localization and themes to ensure the application supports multiple languages and regions",
        "Ensured the mobile responsiveness of applications and optimized for different screen sizes",
        "Collaborated with the team on developing various functionalities and improving the user experience across the projects"
      ],
    }
  ]

  // Contact form
  $scope.formData = {
    name: "",
    email: "",
    message: "",
  }

  $scope.submitForm = () => {
    if ($scope.contactForm.$valid) {
      // In a real application, you would send this data to a server
      console.log("Form submitted:", $scope.formData)
      alert("Thank you for your message! I will get back to you soon.")

      // Reset form
      $scope.formData = {
        name: "",
        email: "",
        message: "",
      }
      $scope.contactForm.$setPristine()
      $scope.contactForm.$setUntouched()
    }
  }
})

