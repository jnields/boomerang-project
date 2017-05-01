const panels = [
  {
    name: 'Students',
    reports: [
      {
        name: 'Alpha Student Master list for VIP Table',
        download: async () => {

        },
      },
      {
        name: 'Student Address List',
        download: async () => {

        },
      },
      {
        name: 'Student Mailing Labels',
        download: async () => {

        },
      },
    ],
  },
  {
    name: 'Leaders',
    reports: [
      {
        name: 'Alpha Leader Master List',
        download: async () => {

        },
      },
      {
        name: 'Leader Address List',
        download: async () => {

        },
      },
      {
        name: 'Group Leader Master List',
        download: async () => {

        },
      },
      {
        name: 'Leader Mailing Labels',
        download: async () => {

        },
      },
    ],
  },
  {
    name: 'Groups',
    reports: [
      {
        name: 'Standard Group List',
        download: async () => {

        },
      },
      {
        name: 'Standard Group List With Language',
        download: async () => {

        },
      },
      {
        name: 'Birthday Report',
        download: async () => {

        },
      },
    ],
  },
  {
    name: 'Name Tags',
    reports: [
      {
        name: 'Student Name Tags',
        download: async () => {

        },
      },
      {
        name: 'Leader Name Tags',
        download: async () => {

        },
      },
    ],
  },
];

let i = 0;
panels.forEach(
  panel => panel.reports.forEach(
    (report) => {
      // eslint-disable-next-line
      report.key = i;
      i += 1;
    },
  ),
);
export default panels;
