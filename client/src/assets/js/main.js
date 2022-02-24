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
                    News_text
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

query("http://localhost:8080/graphql", "allnews", 1);

function renderer(array, second) {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
    //let news_date =array[i].News_date.substr()
    let news_body = JSON.parse(array[i].News_text);
    let img = news_body.array.find((item) => item.image);
    console.log(img);

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
    firstImg.setAttribute("src", `http://localhost:8080/${img.image}`);
    firstImg.setAttribute("alt", "aa");
    firstImg.classList.add("img-fluid");
    hovereffect.classList.add("hovereffect");

    blogMeta.classList.add("blog-meta", "big-meta", "col-md-8");
    secondLink.setAttribute("href", `/news/${array[i].News_id}`);
    secondLink.textContent = array[i].News_title;
    par.textContent = array[i].News_description;
    firstSmall.classList.add("firstsmall");
    categoryLink.classList.add("bg-orange");
    categoryLink.setAttribute("href", "/categoryfirst");
    categoryLink.textContent = array[i].News_category;
    dateLink.setAttribute("href", "/single");
    dateLink.textContent = array[i].News_date;
    //  console.log(i.News_date);
    viewLink.setAttribute("href", "/single");
    viewLink.textContent = array[i].News_counter;
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
    list.append(blogBox);
  }

  let pages = second.pages;

  for (let i = 1; i <= pages; i++) {
    let li = document.createElement("li");
    let li_link = document.createElement("a");

    li.classList.add("page-item");
    li_link.classList.add("page-link");
    li_link.textContent = i;

    li.append(li_link);
    pagination.prepend(li);
  }
}

async function render(page) {
  let res = await query("http://localhost:8080/graphql", "allnews", page);
  console.log(await res.data.All_news[0].results);
  renderer(
    await res.data.All_news[0].results,
    await res.data.All_news[0].info[0]
  );
}

render(1);

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
