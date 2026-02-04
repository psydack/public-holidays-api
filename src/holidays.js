/**
 * Public Holidays Database
 * Easily expandable for more countries
 */

const HOLIDAYS = {
  'BR': {
    name: 'Brazil',
    holidays: [
      { month: 1, day: 1, name: 'New Year\'s Day', type: 'national' },
      { month: 1, day: 25, name: 'São Paulo City Anniversary', type: 'regional', regions: ['SP'] },
      { month: 2, day: null, nth: 3, weekday: 0, name: 'Carnival', type: 'national' },
      { month: 3, day: null, nth: 4, weekday: 0, name: 'Easter', type: 'national' },
      { month: 4, day: 21, name: 'Tiradentes Day', type: 'national' },
      { month: 5, day: 1, name: 'Labor Day', type: 'national' },
      { month: 6, day: null, nth: 1, weekday: 4, name: 'Corpus Christi', type: 'national' },
      { month: 9, day: 7, name: 'Independence Day', type: 'national' },
      { month: 10, day: 12, name: 'Our Lady of Aparecida', type: 'national' },
      { month: 11, day: 2, name: 'All Souls\' Day', type: 'national' },
      { month: 11, day: 15, name: 'Republic Proclamation Day', type: 'national' },
      { month: 12, day: 25, name: 'Christmas Day', type: 'national' }
    ]
  },
  'US': {
    name: 'United States',
    holidays: [
      { month: 1, day: 1, name: 'New Year\'s Day', type: 'national' },
      { month: 1, day: null, nth: 3, weekday: 1, name: 'Martin Luther King Jr. Day', type: 'national' },
      { month: 2, day: null, nth: 3, weekday: 1, name: 'Presidents\' Day', type: 'national' },
      { month: 5, day: null, nth: -1, weekday: 1, name: 'Memorial Day', type: 'national' },
      { month: 6, day: 19, name: 'Juneteenth', type: 'national' },
      { month: 7, day: 4, name: 'Independence Day', type: 'national' },
      { month: 9, day: null, nth: 1, weekday: 1, name: 'Labor Day', type: 'national' },
      { month: 10, day: null, nth: 2, weekday: 1, name: 'Columbus Day', type: 'national' },
      { month: 11, day: 11, name: 'Veterans Day', type: 'national' },
      { month: 11, day: null, nth: 4, weekday: 4, name: 'Thanksgiving Day', type: 'national' },
      { month: 12, day: 25, name: 'Christmas Day', type: 'national' }
    ]
  },
  'UK': {
    name: 'United Kingdom',
    holidays: [
      { month: 1, day: 1, name: 'New Year\'s Day', type: 'national' },
      { month: 3, day: null, nth: -1, weekday: 1, name: 'Easter Monday', type: 'national' },
      { month: 5, day: null, nth: 1, weekday: 1, name: 'Early May Bank Holiday', type: 'national' },
      { month: 5, day: null, nth: -1, weekday: 1, name: 'Spring Bank Holiday', type: 'national' },
      { month: 8, day: null, nth: -1, weekday: 1, name: 'Summer Bank Holiday', type: 'national' },
      { month: 12, day: 25, name: 'Christmas Day', type: 'national' },
      { month: 12, day: 26, name: 'Boxing Day', type: 'national' }
    ]
  }
};

/**
 * Calculate nth weekday of month (e.g., 3rd Monday)
 * nth: positive for nth from start, negative for nth from end
 */
function getNthWeekday(year, month, weekday, nth) {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0

  if (nth > 0) {
    const day = 1 + (weekday - firstWeekday + 7) % 7 + (nth - 1) * 7;
    return new Date(year, month - 1, day);
  } else {
    const lastDay = new Date(year, month, 0).getDate();
    const lastWeekday = (new Date(year, month - 1, lastDay).getDay() + 6) % 7;
    const day = lastDay - (lastWeekday - weekday + 7) % 7 - (Math.abs(nth) - 1) * 7;
    return new Date(year, month - 1, day);
  }
}

/**
 * Get holidays for a country in a year
 */
function getHolidays(country, year) {
  const countryData = HOLIDAYS[country.toUpperCase()];

  if (!countryData) {
    return {
      error: `Country not supported: ${country}`,
      supported_countries: Object.keys(HOLIDAYS)
    };
  }

  const holidays = [];

  countryData.holidays.forEach(h => {
    let date;

    if (h.day) {
      date = new Date(year, h.month - 1, h.day);
    } else {
      date = getNthWeekday(year, h.month, h.weekday, h.nth);
    }

    holidays.push({
      date: date.toISOString().split('T')[0],
      name: h.name,
      type: h.type,
      regions: h.regions || null
    });
  });

  return {
    country: country,
    country_name: countryData.name,
    year: year,
    holidays: holidays
  };
}

/**
 * Check if a date is a business day
 */
function isBusinessDay(dateStr, country) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      date: dateStr,
      is_business_day: false,
      reason: 'weekend'
    };
  }

  // Holiday check
  const holidays = getHolidays(country, date.getFullYear());
  const holiday = holidays.holidays.find(h => h.date === dateStr);

  if (holiday) {
    return {
      date: dateStr,
      is_business_day: false,
      reason: 'holiday',
      holiday: holiday.name
    };
  }

  return {
    date: dateStr,
    is_business_day: true,
    reason: 'business day'
  };
}

/**
 * Get next business day
 */
function getNextBusinessDay(dateStr, country) {
  let date = new Date(dateStr);
  date.setDate(date.getDate() + 1);

  while (true) {
    const check = isBusinessDay(date.toISOString().split('T')[0], country);
    if (check.is_business_day) {
      return check;
    }
    date.setDate(date.getDate() + 1);
  }
}

/**
 * Count business days between dates
 */
function countBusinessDays(startDate, endDate, country) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  let current = new Date(start);

  while (current <= end) {
    const check = isBusinessDay(current.toISOString().split('T')[0], country);
    if (check.is_business_day) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    start_date: startDate,
    end_date: endDate,
    country: country,
    business_days: count,
    calendar_days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  };
}

/**
 * Get supported countries
 */
function getSupportedCountries() {
  return Object.keys(HOLIDAYS).map(code => ({
    code: code,
    name: HOLIDAYS[code].name
  }));
}

module.exports = {
  getHolidays,
  isBusinessDay,
  getNextBusinessDay,
  countBusinessDays,
  getSupportedCountries
};
