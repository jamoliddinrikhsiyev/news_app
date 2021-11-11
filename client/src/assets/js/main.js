const list = document.querySelector(".blog-list");
const pagination = document.querySelector(".pagination");
const host = window.location.host;

async function query(url, route, page, args) {
  let res;
  if (route == "allnews") {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query news($page: Int){
                All_news(page: $page){
                  info{
                    pages
                    count
                    next
                    prev
                  }
                    results{
                    News_id
                    News_title
                    News_description
                    News_image
                    News_counter
                    News_category
                    News_date
                  }
                }
              }
            `,
        variables: {
          page: page,
        },
      }),
    });
  }
  return await res.json();
}

query("http://192.168.0.106:8080/graphql", "allnews", 1);

function renderer(array, second) {
  for (let i of array) {
    let blogBox = document.createElement("div");

    let firstCol = document.createElement("div");
    let postMedia = document.createElement("div");
    let firstLink = document.createElement("a");
    let firstImg = document.createElement("img");
    let hovereffect = document.createElement("div");

    let blogMeta = document.createElement("div");
    let head = document.createElement("h4");
    let secondLink = document.createElement("a");
    let par = document.createElement("p");
    let firstSmall = document.createElement("small");
    let categoryLink = document.createElement("a");
    let date = document.createElement("small");
    let dateLink = document.createElement("a");
    let views = document.createElement("small");
    let viewLink = document.createElement("a");
    let views_i = document.createElement("i");

    blogBox.classList.add("blog-box", "row");
    firstCol.classList.add("col-md-4");
    postMedia.classList.add("post-media");
    firstLink.setAttribute("href", "/single");
    firstImg.setAttribute("src", `http://localhost:8080/${i.News_image}`);
    firstImg.setAttribute("alt", "aa");
    firstImg.classList.add("img-fluid");
    hovereffect.classList.add("hovereffect");

    blogMeta.classList.add("blog-meta", "big-meta", "col-md-8");
    secondLink.setAttribute("href", "/single");
    secondLink.textContent = i.News_title;
    par.textContent = i.News_description;
    firstSmall.classList.add("firstsmall");
    categoryLink.classList.add("bg-orange");
    categoryLink.setAttribute("href", "/categoryfirst");
    categoryLink.textContent = i.News_category;
    dateLink.setAttribute("href", "/single");
    dateLink.textContent = i.News_date;
    viewLink.setAttribute("href", "/single");
    viewLink.textContent = i.News_counter;
    views_i.classList.add("fa", "fa-eye");

    firstLink.prepend(hovereffect, firstImg);
    postMedia.append(firstLink);
    firstCol.append(postMedia);

    head.append(secondLink);
    firstSmall.append(categoryLink);
    date.append(dateLink);
    viewLink.prepend(views_i);
    views.append(viewLink);

    blogMeta.append(head, par, firstSmall, date, views);

    blogBox.append(firstCol, blogMeta);
    console.log(blogBox);
    list.prepend(blogBox);
  }

  let page = pag();

  while (page.next().value <= second.pages) {
    let li = document.createElement("li");
    let li_link = document.createElement("a");

    li.classList.add("page-item");
    li_link.classList.add("page-link");
    li_link.textContent = page.next().value;

    li.append(li_link);
    console.log(page.next().value);
    pagination.append(li);
  }
}

async function render(page) {
  let res = await query("http://192.168.0.106:8080/graphql", "allnews", page);
  renderer(await res.data.All_news[0].results, await res.data.All_news[0].info);
}

render(1);

function* pag(arg) {
  let index = 1;
  while (index <= arg) {
    yield index++;
  }
}
/*


<div class="blog-box row">
                                    <div class="col-md-4">
                                        <div class="post-media">
                                            <a href="/single" title="">
                                                <img src="upload/tech_blog_01.jpg" alt="aa" class="img-fluid">
                                                <div class="hovereffect"></div>
                                            </a>
                                        </div><!-- end media -->
                                    </div><!-- end col -->

                                    <div class="blog-meta big-meta col-md-8">
                                        <h4><a href="/single" title="">Top 10 phone applications and 2017 mobile design awards</a></h4>
                                        <p>Aenean interdum arcu blandit, vehicula magna non, placerat elit. Mauris et pharetratortor. Suspendissea sodales urna. In at augue elit. Vivamus enim nibh, maximus ac felis nec, maximus tempor odio.</p>
                                        <small class="firstsmall"><a class="bg-orange" href="/categoryfirst" title="">Gadgets</a></small>
                                        <small><a href="/single" title="">21 July, 2017</a></small>
                                        <small><a href="/single" title=""><i class="fa fa-eye"></i> 1114</a></small>
                                    </div><!-- end meta -->
                                </div>




*/
