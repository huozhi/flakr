function EventsHub() {
  const pool = {}

  function proxy(name, value) {
    pool[name] = value
    return pool[name]
  }

  function has(name) { 
    return !!pool[name]
  }

  return {has, proxy}
}

export default EventsHub
