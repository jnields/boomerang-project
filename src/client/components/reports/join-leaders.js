function joinList(items = []) {
  switch (items.length) {
    case 0:
      return 'None Listed';
    case 1:
      return items[0];
    case 2:
      return items.join(' and ');
    default:
      return `${items.slice(0, items.length - 1).join(', ')} and ${items[items.length - 1]}`;
  }
}

export default function (leaders = []) {
  return joinList(leaders.map(
    leader => `${leader.firstName} ${leader.lastName}`.trim(),
  ));
}
