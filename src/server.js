// Welcome to the tutorial!

import { createServer, Model, hasMany, belongsTo ,RestSerializer,Factory} from "miragejs"

export default function () {
  createServer({
    serializers: {
        reminder: RestSerializer.extend({
          include: ["list"],
          embed: true,
        }),
      },

      factories: {
        list: Factory.extend({
            name(i) {
              return `List ${i}`;
            },
          }),

        reminder: Factory.extend({
          text(i) {
            return `Reminder ${i}`
          }
        }),
      },

    models:{
        reminder: Model.extend({
            list:belongsTo(),
        }),
        list: Model.extend({
            reminder: hasMany(),
        }),
    },

    seeds(server) {
        server.create("reminder", { text: "Walk the dog" })
        server.create("reminder", { text: "Take out the trash" })
        server.create("reminder", { text: "Work out" })
        

        let homeList = server.create("list", { name: "Home" });
        server.create("reminder", { list: homeList, text: "Do taxes" });
      
        let workList = server.create("list", { name: "Work" });
        server.create("reminder", { list: workList, text: "Visit bank" });
      },

    routes() {
      this.get("/api/reminders", (schema) => {
        return schema.reminders.all()
      })

      
      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        console.log(attrs)
        return schema.reminders.create(attrs)
      })

      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id
      
        return schema.reminders.find(id).destroy()
      })

      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id
        console.log(listId);
        let list = schema.lists.find(listId)
      
        return list.reminders
      })

    },
  })
}