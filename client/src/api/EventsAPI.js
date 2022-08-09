const EventsAPI = {};

EventsAPI.getEvents = function () {
  return new Promise((resolve, reject) => {
    fetch("/events")
      .then((resp) => resp.json())
      .then((data) => {
        data.map((item) => {
          item.start = new Date(item.start);
          item.end = new Date(item.end);
          return item;
        });
        resolve(data);
      })
      .catch((err) => reject(err));
  });
};

EventsAPI.createEvent = function (event) {
  return new Promise((resolve, reject) => {
    fetch("/event/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        resp.start = new Date(resp.start);
        resp.end = new Date(resp.end);
        resolve(resp);
      })
      .catch((err) => reject(err));
  });
};

EventsAPI.updateEvent = function (event) {
  return new Promise((resolve, reject) => {
    fetch(`/event/update/${event._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          resolve(resp);
        }
      })
      .catch((err) => reject(err));
  });
};

EventsAPI.deleteEvent = function (event) {
  return new Promise((resolve, reject) => {
    fetch(`/event/delete/${event._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.ok) {
          resolve(resp);
        }
      })
      .catch((err) => reject(err));
  });
};

export default EventsAPI;
