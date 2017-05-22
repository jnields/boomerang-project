import * as reports from '../containers/reports';

const panels = [
  {
    name: 'Students',
    reports: [
      {
        name: 'Student Master List',
        href: '/reports/students/master',
        component: reports.students.master,
      },
      {
        name: 'Student Address List',
        href: '/reports/students/addresses',
        component: reports.students.addresses,
      },
      {
        name: 'Student Mailing Labels',
        href: '/reports/students/mailing-labels',
        component: reports.students.mailingLabels,
      },
    ],
  },
  {
    name: 'Leaders',
    reports: [
      {
        name: 'Group Leader Master List',
        href: '/reports/leaders/master',
        component: reports.leaders.master,
      },
      {
        name: 'Group Leader Address List',
        href: '/reports/leaders/addresses',
        component: reports.leaders.addresses,
      },
      {
        name: 'Group Leader Mailing Labels',
        href: '/reports/leaders/mailing-labels',
        component: reports.leaders.mailingLabels,
      },
    ],
  },
  {
    name: 'Groups',
    reports: [
      {
        name: 'Standard Group List',
        href: '/reports/groups/master',
        component: reports.groups.master,
      },
      {
        name: 'Standard Group List With Language',
        href: '/reports/groups/language',
        component: reports.groups.language,
      },
      {
        name: 'Birthday Report',
        href: '/reports/groups/birthdays',
        component: reports.groups.birthdays,
      },
    ],
  },
  {
    name: 'Name Tags',
    reports: [
      {
        name: 'Student Name Tags',
        href: '/reports/students/name-tags',
        component: reports.students.nameTags,
      },
      {
        name: 'Leader Name Tags',
        href: '/reports/leaders/name-tags',
        component: reports.leaders.nameTags,
      },
    ],
  },
];

// make array-like: define length properties as non-enumerable
Object.keys(panels).forEach((panel) => {
  Object.defineProperty(
    panels[panel].reports,
    'length',
    { value: Object.keys(panels[panel].reports).length },
  );
});

Object.defineProperty(
  panels,
  'length',
  { value: Object.keys(panels).length },
);

export default state => state || { panels };
