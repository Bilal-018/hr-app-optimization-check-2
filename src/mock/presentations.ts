export const dummyPresentations = [
  {
    id: 1,
    img: "https://www.merchantmaverick.com/wp-content/uploads/2019/09/corporate-office.jpg",
    title: "Company presentation",
    posted: "03 Dec, 2022",
    format: "Pdf",
    user: {
      name: "Jhon",
      img: "",
    },
    summary:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
    presentations: [
      {
        url: "https://www.merchantmaverick.com/wp-content/uploads/2019/09/corporate-office.jpg",
        name: "image1",
      },
      {
        url: "https://www.onboardmeetings.com/wp-content/uploads/2022/04/The-Basics-of-Corporate-Structure-2-1200x675.jpeg",
        name: "image2",
      },
    ],
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/6930549/pexels-photo-6930549.jpeg?cs=srgb&dl=pexels-mikhail-nilov-6930549.jpg&fm=jpg",
    title: "Company presentation 2",
    posted: "03 Jan, 2022",
    format: "Images",
    user: {
      name: "Sam",
      img: "",
    },
    summary:
      "this is a summary of the presentation. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
    presentations: [
      {
        url: "https://media.istockphoto.com/id/1453843862/photo/business-meeting.webp?b=1&s=170667a&w=0&k=20&c=6R54FDDBB-mZHOxT_n1hDa9ow_ExC3gqbChGNKvRVhE=",
        name: "image1",
      },
      {
        url: "https://www.onboardmeetings.com/wp-content/uploads/2022/04/The-Basics-of-Corporate-Structure-2-1200x675.jpeg",
        name: "image2",
      },
    ],
  },
];

export const initialPresentationState = {
  img: "",
  title: "",
  posted: "",
  format: "",
  user: {
    name: "",
    img: "",
  },
  summary: "",
  presentations: [
    {
      url: "",
      name: "",
    },
  ],
};
