const wrapper = document.querySelector(".news_wrapper");

let news_id = window.location.href.slice(
  window.location.href.lastIndexOf("/") + 1
);

async function query(url, route, id, args) {
  let res;
  if (route == "news") {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
              query news($id: Int!){
                  News(id: $id){
                      News_id
                      News_title
                      News_description
                      News_text
                      News_counter
                      News_category
                      News_date
                  }
                }
              `,
        variables: {
          id: id,
        },
      }),
    });
  }
  return await res.json();
}

renderer();
async function renderer() {
  let obj = await query(
    "http://localhost:8080/graphql",
    "news",
    Number(news_id)
  );
  let url = "http://localhost:8080";
  console.log(await obj.data);
  obj.data.News.map((item) => {
    let head = document.createElement("h1");
    head.textContent = item.News_title;
    head.style = "text-align: center";
    let desc = document.createElement("h4");
    desc.textContent = item.News_description;
    desc.style = "font-size: 20px; text-align: left";

    wrapper.append(head);
    wrapper.append(desc);
    let data = JSON.parse(item.News_text);

    let swiper = document.createElement("div");
    swiper.classList.add("swiper");
    let swiper_wrapper = document.createElement("div");
    swiper_wrapper.classList.add("swiper-wrapper");
    let slide = document.createElement("div");
    slide.classList.add("slide");
    swiper.prepend(slide);
    data.array.map((icon) => {
      if (icon.image) {
        let img = document.createElement("img");
        img.src = `${url}${icon.image}`;
        img.width = "900";
        img.height = "500";
        img.style = "margin: 15px; display: block";
        let swiper_slide = document.createElement("div");
        swiper_slide.classList.add("swiper-slide");
        swiper_slide.append(img);
        swiper_wrapper.appendChild(img);
      } else if (icon.text) {
        let text = document.createElement("p");
        text.textContent = icon.text;
        wrapper.appendChild(text);
      }
    });
    swiper.prepend(swiper_wrapper);
    wrapper.append(swiper);
    console.log(data.array);
  });
  slider();
}

function slider(images) {
  let swiper = document.querySelector(".swiper");
  let slide = document.querySelector(".slide");
  let swiper_wrapper = document.querySelector(".swiper-wrapper");
  let swiper_slide = document.querySelectorAll(".swiper-slide");
  console.log(swiper_slide);
  //   swiper_slide.map((item) => {
  //     console.log(item);
  //     item.onclick = (e) => {
  //       console.log(e.target.src);
  //     };
  //   });
}
