// Angular Application
const app = angular.module("portfolioApp", []);

app.controller("MainController", ($scope) => {
  // Mobile menu toggle
  $scope.mobileMenuOpen = false;
  $scope.toggleMenu = () => {
    $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
  };

  // Current year for footer
  $scope.currentYear = new Date().getFullYear();

  // Skills data
  $scope.skillCategories = ["All", "Frontend", "Backend", "Database", "Tools"];
  $scope.selectedCategory = "All";

  $scope.skills = [
    // ---------- Frontend ----------
    {
      name: "HTML5",
      category: "Frontend",
      icon: "public/images/html5-original.svg",
    },
    {
      name: "CSS3",
      category: "Frontend",
      icon: "public/images/css3-original.svg",
    },
    {
      name: "JavaScript",
      category: "Frontend",
      icon: "public/images/javascript-original.svg",
    },
    {
      name: "Angular",
      category: "Frontend",
      icon: "public/images/angularjs-original.svg",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      icon: "public/images/tailwindcss-logotype.a1069bda.svg",
    },
    {
      name: "Bootstrap",
      category: "Frontend",
      icon: "public/images/bootstrap-original.svg",
    },

    // ---------- Backend ----------
    {
      name: "ASP.NET Web API",
      category: "Backend",
      icon: "public/images/dotnetcore-original.svg",
    },
    {
      name: "Blazor",
      category: "Backend",
      icon: "public/images/Blazor.png",
    },
    {
      name: "Clean Architecture",
      category: "Backend",
      icon: "public/images/cleasn_archit.png",
    },
    {
      name: "MVC Architecture",
      category: "Backend",
      icon: "public/images/model-view-controller.png",
    },

    // ---------- Database ----------
    {
      name: "Oracle SQL",
      category: "Database",
      icon: "public/images/oracle-original.svg",
    },
    {
      name: "MS SQL Server",
      category: "Database",
      icon: "public/images/microsoftsqlserver-plain.svg",
    },
    {
      name: "MySQL",
      category: "Database",
      icon: "public/images/mysql-original.svg",
    },

    // ---------- Tools ----------
    {
      name: ".NET",
      category: "Tools",
      icon: "public/images/dotnetcore-original.svg",
    },
    {
      name: "VS Code",
      category: "Tools",
      icon: "public/images/vscode-original.svg",
    },
    {
      name: "Visual Studio",
      category: "Tools",
      icon: "public/images/visualstudio-plain.svg",
    },
    {
      name: "Figma",
      category: "Tools",
      icon: "public/images/Figma-1-logo.png",
    },
    {
      name: "Unit Testing",
      category: "Tools",
      icon: "public/images/testing.png",
    },
  ];

  $scope.filteredSkills = $scope.skills;

  $scope.filterSkills = (category) => {
    $scope.selectedCategory = category;
    $scope.filteredSkills =
      category === "All"
        ? $scope.skills
        : $scope.skills.filter((skill) => skill.category === category);
  };

  // -----------------------------------------
  //          PROJECTS SECTION
  // -----------------------------------------
  $scope.projects = [
    {
      title: "Simply Fresh – Multi-Platform App",
      description:
        "Bilingual .NET MAUI application featuring advanced data analytics (Pivot, GroupBy, Charts) and optimized RESTful API sync.",
      image: "./public/images/simply_fresh.svg",
      technologies: [".NET MAUI", "C#", "REST API", "Data Analytics"],
      details: [
        "Developed bilingual .NET MAUI application supporting web and mobile platforms",
        "Implemented advanced data reporting features including Pivot tables, GroupBy operations, and dynamic Charts based on row selection",
        "Integrated RESTful API with 99.9% uptime and high-performance data synchronization",
        "Optimized mobile UI resulting in a 35% increase in user engagement"
      ]
    },
    {
      title: "OETC – Blazor Hybrid Enterprise App",
      description:
        "Enterprise Blazor Hybrid solution with real-time SignalR notifications, Brevo email integration, and comprehensive Time & Attendance management.",
      image: "./public/images/Oetc.png",
      technologies: ["Blazor Hybrid", "SignalR", "Brevo API", "Management Modules"],
      details: [
        "Architected responsive enterprise application using Blazor Hybrid and Fluent UI components",
        "Implemented real-time internal notifications via SignalR and external automated email notifications using Brevo API",
        "Built a dynamic email/SMS template creation and management system for event-driven communications",
        "Developed integrated Timesheet and Attendance management modules",
        "Designed custom print templates with JavaScript integration, reducing printing errors by 60%"
      ]
    },
    {
      title: "Parryware Enterprise Web Application",
      description:
        "Developed a scalable enterprise application using Clean Architecture with AWS integration, Excel import/export, optimized MSSQL queries, real-time communication via SignalR, and background processing using Hangfire.",
      image: "./public/images/parryware.png",
      technologies: [
        "ASP.NET Core",
        "Clean Architecture",
        "AWS",
        "MSSQL",
        "SignalR",
        "Hangfire",
      ],
      details: [
        "Developed scalable web application using Clean Architecture principles and ASP.NET Core",
        "Integrated AWS cloud services and implemented Excel import/export functionality",
        "Optimized MSSQL database queries resulting in 40% faster data retrieval",
        "Built 12+ reusable modules serving 200+ concurrent users"
      ]
    },
    {
      title: "Ioannou Coetus – International Client Website",
      description:
        "Pixel-perfect Tailwind CSS website with animations and Git workflow for an Australian client.",
      image: "./public/images/Ionnou coetus.png",
      technologies: ["Tailwind CSS", "JavaScript", "Responsive UI", "Git"],
      details: [
        "Created pixel-perfect responsive website using Tailwind CSS and vanilla JavaScript",
        "Implemented smooth animations and Git workflow integration",
        "Delivered for Australian client with international standards"
      ]
    },
    {
      title: "AEGIS – Cross-Platform MAUI App",
      description:
        "Cross-platform .NET MAUI Blazor Hybrid app using MudBlazor with dark/light themes and mobile-first UI.",
      image: "./public/images/aegis_logo.jpg",
      technologies: [".NET MAUI", "Blazor Hybrid", "MudBlazor"],
      details: [
        "Built .NET MAUI Blazor Hybrid application with MudBlazor components",
        "Featured light/dark theme support and mobile-first responsive design",
        "Delivered cross-platform solution for enhanced user experience"
      ]
    },
    {
      title: "Static Websites (Ads Indiaa, Laundry, Rogers, Asset Portal)",
      description:
        "Delivered 3+ static websites with 100% Figma design accuracy and modern responsive UI.",
      image: "./public/images/freepik__plain-blank-static-websites-rogers-delivered-3-sta__4826.png",
      technologies: ["HTML", "CSS", "JavaScript", "Figma", "Bootstrap", "Tailwind CSS"],
      details: [
        "Developed 3+ static websites (Laundry, Rogers, Asset Portal) with 100% Figma design accuracy",
        "Implemented Bootstrap and Tailwind CSS frameworks ensuring cross-browser compatibility",
        "Maintained 98% client satisfaction rate through iterative feedback incorporation"
      ]
    },
  ];

  // Calculate Professional Experience Tenure (from October 1, 2024)
  const experienceStartDate = new Date(2024, 9, 1); // 9 is October in JS Date
  const calculateTenure = () => {
    const now = new Date();
    let years = now.getFullYear() - experienceStartDate.getFullYear();
    let months = now.getMonth() - experienceStartDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    let tenureStr = "";
    if (years > 0) tenureStr += years + (years === 1 ? " Year " : " Years ");
    if (months > 0) tenureStr += months + (months === 1 ? " Month" : " Months");
    return tenureStr.trim() || "1 Month";
  };

  const currentTenure = calculateTenure();

  // -----------------------------------------
  //          EXPERIENCE SECTION
  // -----------------------------------------
  $scope.experience = [
    {
      title: ".NET Developer",
      company: "Focus Logic IT Solutions",
      period: `Oct 2024 – Present (${currentTenure}) | Ranipet, Tamil Nadu`,
      description:
        "Working as a .NET Developer delivering cross-platform solutions, Blazor Hybrid apps, and enterprise applications.",
      responsibilities: [
        "Developed bilingual multi-platform application using .NET MAUI with optimized REST API sync (99.9% uptime).",
        "Architected Blazor Hybrid application with Fluent UI and custom JavaScript-based print templates (reduced errors by 60%).",
        "Built scalable enterprise app using Clean Architecture and ASP.NET Core with AWS integrations.",
        "Implemented real-time communication in enterprise modules using SignalR.",
        "Developed and scheduled heavy background jobs using Hangfire for processing large datasets and automated workflows.",
        "Optimized MSSQL queries improving data retrieval speed by 40%.",
        "Created 12+ reusable modules supporting 200+ concurrent users.",
        "Delivered international projects including Tailwind-based responsive websites for Australian clients.",
        "Implemented MAUI Blazor Hybrid app with MudBlazor and theme support.",
        "Delivered 3+ static websites with 100% Figma accuracy and cross-browser compatibility.",
        "Maintained 98% client satisfaction with iterative feedback and quality delivery.",
      ],
    },
  ];

  // Contact form
  $scope.formData = { name: "", email: "", message: "" };

  $scope.submitForm = () => {
    if ($scope.contactForm.$valid) {
      console.log("Form submitted:", $scope.formData);
      alert("Thank you for your message! I will get back to you soon.");

      $scope.formData = { name: "", email: "", message: "" };
      $scope.contactForm.$setPristine();
      $scope.contactForm.$setUntouched();
    }
  };
});