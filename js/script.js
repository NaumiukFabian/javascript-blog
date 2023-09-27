'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagsLink: Handlebars.compile(document.querySelector('#template-tags-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  cloudLink: Handlebars.compile(document.querySelector('#template-cloud-link').innerHTML)
}

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked');

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const href = clickedElement.getAttribute("href");

  /* find the correct article using the selector (value of 'href' attribute) */
  const articleToActive = document.querySelector(href);

  /* add class 'active' to the correct article */
  articleToActive.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {
  console.log(customSelector);
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  console.log(titleList);
  /* remove contents of titleList */
  titleList.innerHTML = '';
  console.log(titleList);
  /* for each article */
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* create HTML of the link */
    // const linkHTML = '<li><a href="#' + articleId + '">' + articleTitle + '<span></span></a></li>';
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(allTags) {
  let params = { max: 0, min: 999999 };

  for (let tag in allTags) {
    if (allTags[tag] > params.max) {
      params.max = allTags[tag];
    }
    else if (allTags[tag] < params.min) {
      params.min = allTags[tag];
    }
  }

  return params;
}

function calculateTagClass(params, count) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max = params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return classNumber;
}

function generateTags() {

  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};

  /* find all articles */
  let html = '';
  const articlesAll = document.querySelectorAll('article');
  /* START LOOP: for every article: */
  for (let article of articlesAll) {
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    tagsWrapper.innerHTML = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');
    /* split tags into array */
    const arrayTags = tags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of arrayTags) {
      /* generate HTML of the link */
      // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagsLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + ' ' + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      }
      else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    html = '';
  }
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams)
  // let allTagsHTML = '';
  const allTagsData = {tags: []};
  // let tagLinkHTML = '<li><a class="' + optCloudClassPrefix + calculateTagClass(tagsParams, allTags[tag]) + '" href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ') ' + '</a></li>';

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    // allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(tagsParams, allTags[tag])
    });
  }

  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.cloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const avtiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeLink of avtiveLinks) {
    /* remove class active */
    activeLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="#' + href + '"]');
  /* START LOOP: for each found tag link */
  for (tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}



function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"');
  /* START LOOP: for each link */
  for (let link of links) {
    link.addEventListener('click', tagClickHandler
      /* add tagClickHandler as event listener for that link */
      /* END LOOP: for each link */)
  }



}

addClickListenersToTags();

function generateAuthors() {

  const articles = document.querySelectorAll('article');
  let html = '';

  for (let article of articles) {
    html = '';
    const author = article.getAttribute('data-author');
    // html = '<a href="#author-' + author + '">' + author + '</a>'
    const htmlData = {id: author, title: author};
    html = templates.authorLink(htmlData);
    article.querySelector('.post-author').innerHTML = html;
  }


}
generateAuthors()

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const author = clickedElement.getAttribute('href').replace('#author-', '');
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  const noActiveLinksToAuthor = document.querySelectorAll('a[href~="' + author + '"]');
  for (let noActive of noActiveLinksToAuthor) {
    noActive.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthor() {
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthor();
