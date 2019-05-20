define(['helpers/utilities'], function(Utilities){

  var $content;
  var $stage;
  var $thumbs;


  var projects = {
    spectreTest: {
      name: "SpectreTest",
      link: "http://www.spectretest.net/",
      description: 'An animation rich site to promote the movie <strong>Our House</strong>. The site utilizes a combination of CSS/JS animations and transparent videos displayed on canvas elements.',
      img: "spectretest"
    },
    wonder: {
      name: "Wonder",
      link: "",
      description: 'Single page app as a home for the movie <strong>Wonder</strong>. Features a robust custom UI, smooth and playful animations and transitions, and a shareable poster gallery.',
      img: "wonder"
    },
    casamigos: {
      name: "Casamigos",
      link: "",
      description: 'An updated website for <strong>Casamigos Tequila</strong>. Responsible for the frontend and backend build. Exported existing content from old Wordpress into new Craft CMS to retain site data.',
      img: "casamigos"
    },
    titanfall: {
      name: "Titanfall 2",
      link: "",
      description: 'Assisted in frontend developement and maintenance, gaining experience under a senior dev.',
      img: "titanfall"
    },
    fsl: {
      name: "Fox Searchlight",
      link: "http://www.foxsearchlight.com/",
      description: 'Took over maintenance of an existing site. Built several microsite pages for <strong>Foxsearchlight</strong> films.',
      img: "fsl"
    },
    darkplaces: {
      name: "Dark Places",
      link: "http://darkplacesmovie.com/",
      description: 'Features parallax scrolling effects and video backgrounds.',
      img: "darkplaces"
    }
  }

  function init(){
    $content = $("#content");
    appendProjects();
  }

  async function appendProjects() {
    var html = await Utilities.webPNess($("#portfolio-tpl").html());
    $content.append(html);
    setSelectors();
    bindEvents();
  }

  function setSelectors() {
    $stage = $("#stage");
    $thumbs = $("#portfolio .project-thumb");
  }

  function bindEvents() {
    $thumbs.click((e)=>{
      e.preventDefault();
      let target = $(e.currentTarget).attr("data-project");
      openProject(e, target);
    });
  }

  async function openProject(e, trg) {
    var html = $("#project-tpl").html().replace(/@proj-name/g, projects[trg].name).replace(/@proj-desc/g, projects[trg].description).replace(/@proj-src/g, projects[trg].link).replace(/@proj-img/g, projects[trg].img);

    html = await Utilities.webPNess(html);

    $stage.empty().append(html).addClass("project-open");
    if(projects[trg].link == "") {
      $("#project .link").hide();
    }
    Utilities.scrollToTop();
  }

  function destroy() {

  }

  return {
    init: init,
    destroy: destroy
  }
});
