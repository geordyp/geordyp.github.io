//Top Nav bar script v2.1- http://www.dynamicdrive.com/dynamicindex1/sm/index.htm

function showToolbar()
{
// AddItem(id, text, hint, location, alternativeLocation);
// AddSubItem(idParent, text, hint, location, linktarget);

	menu = new Menu();
	menu.addItem("home", "Home", null, null, null);
	menu.addItem("memshp", "Membership", "",  null, null);
	menu.addItem("prog", "Programs and Events", "",  null, null);
	menu.addItem("ldr", "Information", "", null, null);
	menu.addItem("about", "Links", null, null, null);

	menu.addSubItem("home", "Index", "",  "", "");

	menu.addSubItem("memshp", "Executive Board", "",  "", "");
	//menu.addSubItem("memshp", "Chapter Advisor", "",  "advisor.htm", "");
	//menu.addSubItem("memshp", "Roster", "",  "roster.htm", "");

	menu.addSubItem("prog", "Events", "",  "", "");
	menu.addSubItem("prog", "Photos", "",  "", "");
	//menu.addSubItem("prog", "Newsletter", "",  "newsletter.htm", "");

	menu.addSubItem("ldr", "KSU Chapter History", "",  "", "");
	menu.addSubItem("ldr", "Chapter Documents", "",  "", "");
	menu.addSubItem("ldr", "Minutes", "",  "", "");

	menu.addSubItem("about", "KSU Multicultural Engineering Program", "",  "", "");
	menu.addSubItem("about", "NSBE National Homepage", "",  "", "");
	menu.addSubItem("about", "NSBE Region 5 Homepage", "",  "", "");

	menu.showMenu();
}
