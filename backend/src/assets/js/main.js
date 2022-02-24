const form = document.querySelector(".form");
//inputs
const header = document.querySelector(".page_head");
const description = document.querySelector(".page_description");
const textarea = document.querySelector("textarea");
const fileInput = document.querySelector(".file_input");
const select = document.querySelector(".select");
//buttons
const add_to_page = document.querySelector(".add_to_page");
const reset = document.querySelector(".reset");
const add_desc = document.querySelector(".add_desc");
const add_header = document.querySelector(".add_header");
//others
const context = document.querySelector(".context");
const text = document.querySelectorAll(".text");

let formData = new FormData();
let sendData = {};
let index = 1;

formData.append("category", select.value);
select.onchange = function (e) {};

add_header.onclick = function (e) {
  if (!checkHeadAndDesc().header) {
    if (header.value) {
      formData.append("header", header.value);
      addText(header.value, "head");
      header.value = "";
    }
  } else if (checkHeadAndDesc().header) {
    alert("you have added header");
  } else {
    alert("please add header first");
  }
  console.log("Header: ", formData.get("header"));
};

add_desc.onclick = function (e) {
  if (checkHeadAndDesc().header && !checkHeadAndDesc().description) {
    if (description.value) {
      formData.append("description", description.value);
      addText(description.value, "description");
      description.value = "";
    }
  } else if (checkHeadAndDesc().header && checkHeadAndDesc().description) {
    alert("you have added description");
  } else {
    alert("please add header first");
  }
  console.log("Description: ", formData.get("description"));
};

fileInput.addEventListener("change", (evt) => {
  addImage(evt.target.files, 200, 200);
});

add_to_page.addEventListener("click", () => {
  if (checkHeadAndDesc().header && checkHeadAndDesc().description) {
    if (textarea.value) {
      addText(textarea.value, "text");
      textarea.value = "";
    }
  } else {
    alert("please add header and description first");
  }
  console.log("Text: ", formData.get("data"));
});

reset.addEventListener("click", clearAll);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formData.append("data", JSON.stringify(sendData));
  console.log(formData.get("data"));
  formData.append("all", `${index - 1}`);
  index++;
  let response = await fetchData("/api/adminpanel/postnews", formData);
  if (response.status === 200) {
    context.innerHTML = null;
    header.value = "";
    description.value = "";
    textarea.value = "";
    fileInput.value = "";
    select.value = "1";
    formData.delete("header");
    formData.delete("description");
    formData.delete("data");
    formData.delete("all");
    sendData = {};
    index = 1;
    alert("success");
    setTimeout(function () {
      location.reload();
    }, 3000);
  }
});

function checkHeadAndDesc() {
  let obj = {};
  if (context.innerHTML.includes("h1") && !context.innerHTML.includes("h4")) {
    obj.header = true;
  } else if (
    context.innerHTML.includes("h1") &&
    context.innerHTML.includes("h4")
  ) {
    obj.header = true;
    obj.description = true;
  } else if (
    !context.innerHTML.includes("h1") &&
    !context.innerHTML.includes("h4")
  ) {
    obj.header = false;
    obj.description = false;
  }
  return obj;
}

function addText(text, type) {
  if (type === "head") {
    let head = document.createElement("h1");
    head.innerHTML = text;
    context.appendChild(head);
  } else if (type === "description") {
    let desc = document.createElement("h4");
    desc.innerHTML = text;
    context.appendChild(desc);
  } else if (type === "text") {
    sendData[index] = text;
    index++;

    let div = document.createElement("div");
    div.classList.add("text");
    let par = document.createElement("p");
    par.innerHTML = text;
    div.appendChild(par);
    context.appendChild(div);
  }
}

async function addImage(files, width, height) {
  if (checkHeadAndDesc().header && checkHeadAndDesc().description) {
    formData.append(`${index}`, files[0]);
    index++;

    let img = document.createElement("img");
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        img.src = fr.result;
      };
      fr.readAsDataURL(files[0]);
    }
    if (width) img.width = width;
    if (height) img.height = height;
    context.appendChild(img);
  }
}

function clearAll(e) {
  context.innerHTML = "";
  textarea.value = "";
  fileInput.value = "";
}

async function fetchData(api, data) {
  console.log(data);
  let res = await fetch(api, {
    method: "POST",
    body: data,
  });
  let obj = {
    status: res.status,
    data: await res.json(),
  };
  return obj;
}
