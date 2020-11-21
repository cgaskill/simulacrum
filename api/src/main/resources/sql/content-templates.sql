insert into ContentItemTemplates
(type, sub_type, fields) VALUES ('character','player', '{
  "type":"character",
  "subType":"player",
  "fields": [{
    name: "name",
    label: "Name",
    component: "text"
  },
  {
    name: "description",
    label: "Description",
    component: "textarea"
  },
  {
    name: "notes",
    label: "Notes",
    component: "textarea"
  },
  {
    name: "gmNotes",
    label: "GM Notes",
    component: "textarea"
  }]
}')
