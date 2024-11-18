import { all } from "axios";
import { request } from "http";
import next from "next";

export const translations = {
    en: {
      ai: "AI Assistant",
      samah: "Samah",
      dashboard: "Dashboard",
      users: "Users",
      settings: "Settings",
      myAssignedOpinions: "My Assigned Opinions",
      assignedOpinionsMessage: "Manage and process assigned opinions",
      opinionManagement: "Opinion Management",
      opinionsGovernment: "Opinions / Government and Opinion Management",
      filter: "Filter",
      searchOpinion: "Search Opinions...",
      unassignedCard: "Unassigned", 
      todocard: "To-do",
      progressCard: "In Progress",
      testingCard: "Testing",
      reviewCard: "Review",
      completedCard: "Completed",
      onholdCard: "On Hold",
      rejectedCard: "Rejected",
      addTask: "Add Task",
      languageToggle: "English",
      logout: "Logout",
      Requests: "Requests",
      viewHistory: "View History",
      requestStatus: "Request Status",
      requestHistory: "Request History",
      support: "Support",
      emptyText: "Your Service List is Empty",
      emptyText2: "We're here for all your needs, just a few clicks away.",
      searchEngine: "Search Engine",
      images: "Images",
      places: "Places",
      maps: "Maps",
      news: "News",
      scholar: "Scholar",
      patents: "Patents",
      summary: "Summary",
      summarize: "Summarize",
      details: "Details",
      noresult: "No results found",
      enterSearch: "Please enter a search query",
      profile: "Profile",
      account: "Account",
      profilePic: "Profile Picture",
      profileName: "Profile Name",
      username: "Username",
      aboutme: "About Me",
      email: "Email",
      language: "Language",
      password: "Password",
      changePassword: "Change Password",
      deletepic: "Delete Picture",
      saveChanges: "Save Changes",
      employeeManagement: "Employee Management",
      addEmployee: "Add Employee",
      addNewEmployee: "Add New Employee",
      import: "Import",
      export: "Export",
      exportPDF: "Export as PDF",
      exportExcel: "Export as Excel",
      exportCSV: "Export as CSV",
      searchEmployee: "Search Employee",
      allTypes: "All Types",
      allDepartments: "All Departments",
      allRoles: "All Roles",
      searchEmployees: "Search employees",
      position: "Position",
      employeeID: "Employee ID",
      workType: "Work Type",
      department: "Department",
      phone: "Phone",
      name: "Name",
      systemTitle: "Samah",
      filterTask: "Filter Tasks",
      assignee: "Assignee",
      allAssignee: "All Assignee",
      clear: "Clear",
      applyfilters: "Apply Filters",
      passwordDialog: "Enter your current password and new password to change it.",
      current: "Current",
      new: "New",
      confirm: "Confirm",
      keyPoints: "Key Points",
      trends: "Trends",
      staffPortal: "Staff Portal",
      submitOpinion: "Submit Opinion",
      submitMessage: "Submit your opinions and track their status",
      searchSubmission: "Search your submissions...",
      newOpinion: "New Opinion",
      noOpinion: "No opinions submitted yet",
      noOpinion2: "Start by submitting your first opinion",
      submitNewOpinion: "Submit New Opinion",
      basicInfo: "Basic Information",
      opinionDetails: "Opinion Details",
      supportingDocuments: "Supporting Documents",
      reviewSubmit: "Review & Submit",
      opinionTitle: "Opinion Title",
      category: "Category",
      subCategory: "Sub-Category",
      priorityLevel: "Priority Level",
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
      yourName: "Your Name",
      emailAddress: "Email Address",
      requestStatement: "Request Statement",
      challengesOpportunities: "Challenges / Opportunities",
      subjectContent: "Subject Content",
      alternativeOptions: "Alternative Options",
      expectedImpact: "Expected Impact",
      potentialRisks: "Potential Risks and Mitigation",
      studiesStatistics: "Studies and Statistics",
      legalFinancialOpinions: "Legal and Financial Opinions",
      stakeholderFeedback: "Stakeholder Feedback",
      workPlan: "Work Plan",
      decisionDraft: "Decision Draft",
      dropMessage: "Drop files here or click to upload",
      dropMessage2: "PDF, DOC, DOCX, XLS, XLSX up to 10MB each",
      previous: "Previous",
      next: "Next",
      cancel: "Cancel",
      submit: "Submit",
      editOpinion: "Edit Opinion",
      opinionReview: "Please review your opinion details before submitting. Make sure all information is accurate.",
    },
    ar: {
      ai: "AI Assistant",
      samah: "سماح",
      dashboard: "لوحة التحكم",
      users: "المستخدمين",
      settings: "الإعدادات",
      myAssignedOpinions: "الآراء المعينة لي",
      assignedOpinionsMessage: "إدارة ومعالجة الآراء المعينة",
      opinionManagement: "إدارة الآراء",
      opinionsGovernment: "الآراء / الحكومة وإدارة الرأي",
      filter: "تصفية",
      searchOpinion: "البحث عن الآراء...",
      unassignedCard: "غير معين",
      todocard: "إلى القيام به",
      progressCard: "قيد التقدم",
      testingCard: "اختبار",
      reviewCard: "مراجعة",
      completedCard: "منجز",
      onholdCard: "في الانتظار",
      rejectedCard: "مرفوض",
      addTask: "إضافة مهمة",
      languageToggle: "العربية",
      logout: "تسجيل الخروج",
      Requests: "طلبات",
      viewHistory: "عرض التاريخ",
      requestStatus: "حالة الطلب",
      requestHistory: "تاريخ الطلب",
      support: "الدعم",
      emptyText: "قائمة الخدمات الخاصة بك فارغة",
      emptyText2: "نحن هنا لجميع احتياجاتك، على بعد بضع نقرات.",
      searchEngine: "محرك البحث",
      images: "الصور",
      places: "الأماكن",
      maps: "الخرائط",
      news: "الأخبار",
      scholar: "العلماء",
      patents: "البراءات",
      summary: "تلخيص",
      summarize: "تلخيص",
      details: "تفاصيل",
      noresult: "لم يتم العثور على نتائج",
      enterSearch: "الرجاء إدخال استعلام بحث",
      profile: "الملف الشخصي",
      account: "الحساب",
      profilePic: "صورة الملف الشخصي",
      profileName: "اسم الملف الشخصي",
      username: "اسم المستخدم",
      aboutme: "عني",
      email: "البريد الإلكتروني",
      language: "اللغة",
      password: "كلمة السر",
      changePassword: "تغيير كلمة المرور",
      deletepic: "حذف الصورة",
      saveChanges: "حفظ التغييرات",
      employeeManagement: "إدارة الموظفين",
      addEmployee: "إضافة موظف",
      addNewEmployee: "إضافة موظف جديد",
      import: "استيراد",
      export: "تصدير",
      exportPDF: "تصدير كـ PDF",
      exportExcel: "تصدير كـ Excel",
      exportCSV: "تصدير كـ CSV",
      searchEmployee: "البحث عن موظف",
      allTypes: "جميع الأنواع",
      allDepartments: "جميع الإدارات",
      allRoles: "جميع الأدوار",
      searchEmployees: "البحث عن الموظفين",
      position: "المنصب",
      employeeID: "رقم الموظف",
      workType: "نوع العمل",
      department: "الإدارة",
      phone: "الهاتف",
      name: "الاسم",
      systemTitle: "سماح",
      filterTask: "تصفية المهام",
      assignee: "المعين",
      allAssignee: "جميع المعينين",
      clear: "مسح",
      applyfilters: "تطبيق الفلاتر",
      passwordDialog: "أدخل كلمة المرور الحالية وكلمة المرور الجديدة لتغييرها.",
      current: "الحالية",
      new: "جديد",
      confirm: "تأكيد",
      keyPoints: "النقاط الرئيسية",
      trends: "الاتجاهات",
      staffPortal: "بوابة الموظفين",
      submitOpinion: "إرسال الرأي",
      submitMessage: "أرسل آراءك وتتبع حالتها",
      searchSubmission: "ابحث عن تقديماتك...",
      newOpinion: "رأي جديد",
      noOpinion: "لم يتم تقديم آراء بعد",
      noOpinion2: "ابدأ بتقديم رأيك الأول",
      submitNewOpinion: "تقديم رأي جديد",
      basicInfo: "المعلومات الأساسية",
      opinionDetails: "تفاصيل الرأي",
      supportingDocuments: "المستندات الداعمة",
      reviewSubmit: "مراجعة وإرسال",
      opinionTitle: "عنوان الرأي",
      category: "الفئة",
      subCategory: "الفئة الفرعية",
      priorityLevel: "مستوى الأولوية",
      urgent: "عاجل",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
      yourName: "اسمك",
      emailAddress: "عنوان البريد الإلكتروني",
      requestStatement: "بيان الطلب",
      challengesOpportunities: "التحديات / الفرص",
      subjectContent: "محتوى الموضوع",
      alternativeOptions: "خيارات بديلة",
      expectedImpact: "التأثير المتوقع",
      potentialRisks: "المخاطر المحتملة والتخفيف",
      studiesStatistics: "الدراسات والإحصاءات",
      legalFinancialOpinions: "الآراء القانونية والمالية",
      stakeholderFeedback: "تغذية راجعة",
      workPlan: "خطة العمل",
      decisionDraft: "مسودة القرار",
      dropMessage: "اسحب الملفات هنا أو انقر للتحميل",
      dropMessage2: "PDF، DOC، DOCX، XLS، XLSX حتى 10 ميغابايت لكل منها",
      previous: "السابق",
      cancel: "إلغاء",
      next: "التالي",
      submit: "إرسال",
      editOpinion: "تعديل الرأي",
      opinionReview: "يرجى مراجعة تفاصيل الرأي الخاص بك قبل التقديم. تأكد من دقة جميع المعلومات.",
    },
  };
  