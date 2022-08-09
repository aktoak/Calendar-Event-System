import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventsAPI from "./api/EventsAPI";
import "./styles/App.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DragAndDropCalendar = withDragAndDrop(Calendar);

function App() {
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    console.log("rendered");
    EventsAPI.getEvents()
      .then((data) => setAllEvents(data))
      .catch((err) => console.log(err));
  }, []);

  // handle add event action
  function handleAddEvent() {
    if (newEvent.title === "" || newEvent.start === "" || newEvent.end === "") {
      alert("Fill up all the required fields before adding new Event");
      return;
    } else if (newEvent.start > newEvent.end) {
      alert("Error, start date should always be before the end date");
      return;
    }
    EventsAPI.createEvent(newEvent)
      .then((event) => {
        setAllEvents([...allEvents, event]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // resize event callback
  function onEventResize(data) {
    const { start, end } = data;

    EventsAPI.updateEvent({
      title: data.event.title,
      _id: data.event._id,
      start: start,
      end: end,
    })
      .then((resp) => {
        setAllEvents([
          ...allEvents.map((event) => {
            if (event._id === data.event._id) {
              event.start = start;
              event.end = end;
            }
            return event;
          }),
        ]);
      })
      .catch((err) => console.log(err));
  }

  // drop event callback
  function onEventDrop(data) {
    const { start, end } = data;

    EventsAPI.updateEvent(data.event)
      .then((resp) => {
        setAllEvents([
          ...allEvents.map((event) => {
            if (event._id === data.event._id) {
              event.start = start;
              event.end = end;
            }
            return event;
          }),
        ]);
      })
      .catch((err) => console.log(err));
  }

  //Clicking an existing event allows you to remove it
  function onSelectEvent(pEvent) {
    const r = window.confirm("Would you like to remove this event?");
    if (r === true) {
      EventsAPI.deleteEvent(pEvent)
        .then((resp) => {
          setAllEvents([
            ...allEvents.filter((event) => {
              return event._id !== pEvent._id;
            }),
          ]);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="App">
      <h1>Event System</h1>
      <div className="flex-container">
        <input
          type="text"
          placeholder="Add Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          style={{ marginRight: "10px" }}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <DragAndDropCalendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        views={{
          month: true,
          week: true,
          day: true,
        }}
        resizable
        onEventResize={onEventResize}
        onEventDrop={onEventDrop}
        onSelectEvent={onSelectEvent}
        defaultView="month"
        style={{ height: "80vh", margin: "50px" }}
      />
    </div>
  );
}

export default App;
