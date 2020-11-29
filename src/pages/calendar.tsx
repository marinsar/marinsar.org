import { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';

const MIN_MONTH_VIEW_WIDTH_PX = 768;

const CalendarPage = () => {
  const [width, setWidth] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    setWidth(ref.current.getBoundingClientRect().width);
  }, [ref.current, setWidth]);

  return (
    <Layout title='Calendar'>
      <div className='p-8 sm:p-16'>
        <div ref={ref}>
          {width && width < MIN_MONTH_VIEW_WIDTH_PX && (
            <iframe
              src='https://www.google.com/calendar/embed?mode=AGENDA&amp;showPrint=0&amp;showCalendars=0&amp;showTz=0&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=marinsar.org_0o6b82oo7blg5ce5st1qqvcf6k%40group.calendar.google.com&amp;color=%23875509&amp;ctz=America%2FLos_Angeles'
              className='border-0 mx-auto'
              width={width}
              height={Math.max(Math.round(0.67 * width), 400)}
              scrolling='no'
            ></iframe>
          )}
          {/* Setting the `src` prop dynamically triggers X-FRAME-OPTIONS errors for some reason, hence the duplication */}
          {width && width >= MIN_MONTH_VIEW_WIDTH_PX && (
            <iframe
              src='https://www.google.com/calendar/embed?mode=MONTH&amp;showPrint=0&amp;showCalendars=0&amp;showTz=0&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=marinsar.org_0o6b82oo7blg5ce5st1qqvcf6k%40group.calendar.google.com&amp;color=%23875509&amp;ctz=America%2FLos_Angeles'
              className='border-0 mx-auto'
              width={width}
              height={Math.max(Math.round(0.67 * width), 400)}
              scrolling='no'
            ></iframe>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
