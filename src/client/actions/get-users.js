import api from '../helpers/api';

function getUrlChunks(names) {
  const chunks = [];
  let chunk = [];
  const limit = 2000 - 'https://db.boomerang-project.com/api/groups?%24attributes=id&%24attributes=name'.length;
  for (let i = 0, req = ''; i < names.length; i += 1) {
    const name = names[i];
    if ((`${req}&name=${encodeURIComponent(name)}`).length > limit) {
      chunks.push(chunk);
      chunk = [];
      req = '';
    }
    chunk.push(name);
    req += `&name=${name}`;
  }
  if (chunk.length) chunks.push(chunk);
  return chunks;
}

export default async (items, type) => {
  const groups = {};
  const resolvers = {};
  const rejectors = {};
  items.forEach(({ group }) => {
    if (!group || !group.name) return;
    groups[group.name] = groups[group.name] || new Promise((resolve, reject) => {
      resolvers[group.name] = resolve;
      rejectors[group.name] = reject;
    });
  });

  const toAdd = [];
  const queryExisting = getUrlChunks(Object.keys(groups)).map(
    names => api.groups.query({
      $attributes: ['id', 'name'],
      name: names,
    }).then(
      ({ statusCode, body }) => {
        const map = names.reduce((acc, name) => ({ ...acc, [name]: true }), {});
        if (statusCode < 400) {
          body.results.forEach((group) => {
            resolvers[group.name](group.id);
            delete map[group.name];
          });
          [].push.apply(toAdd, Object.keys(map).map(name => ({ name })));
        } else {
          throw new Error();
        }
      },
    ),
  );

  Promise.all(queryExisting).then(() => {
    if (toAdd.length === 0) return;
    api.groups.post(toAdd).then(
      ({ statusCode, body }) => {
        if (statusCode < 400) {
          body.forEach((group) => {
            resolvers[group.name](group.id);
          });
        } else throw new Error();
      },
    );
  });

  return Promise.all(items.map(async (item) => {
    const result = { ...item, type };
    if (item.group && item.group.name) {
      result.groupId = await groups[item.group.name];
    }
    delete result.group;
    return result;
  }));
};
