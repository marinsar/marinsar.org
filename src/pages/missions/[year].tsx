import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

import { Layout } from '../../components/Layout';
import { PageLayout } from '../../components/PageLayout';
import { getMissions, Mission } from '../../lib/api';
import { getMissionYears } from '../../lib/utils';

interface MissionsPageProps {
  missions: Mission[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getMissionYears().map((year) => ({
    params: { year: String(year) },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  MissionsPageProps,
  { year: string }
> = async ({ params }) => {
  const missions = await getMissions(+params!.year);

  return {
    props: {
      missions,
      revalidate: Number(process.env.REVALIDATE_TIME_S),
    },
  };
};

const MissionsPage: FunctionComponent<MissionsPageProps> = ({ missions }) => {
  const router = useRouter();
  const { year } = router.query;

  return (
    <Layout title={`${year} Missions`}>
      <PageLayout>
        <p>
          <Link href='/missions'>
            <a>← Back to all years</a>
          </Link>
        </p>
        {missions.map(({ id, missionNumber, title, date, summary }) => (
          <section key={id} id={missionNumber}>
            <a
              href={`#${missionNumber}`}
              className='no-underline'
              style={{ textDecoration: 'none' }}
            >
              <h2 className='flex items-center space-x-4'>
                <div className='text-sm p-1 bg-gray-200 rounded text-gray-700 whitespace-nowrap'>
                  {missionNumber}
                </div>{' '}
                <div>
                  {title}{' '}
                  <span className='font-normal'>
                    ({new Date(date).toLocaleDateString()})
                  </span>
                </div>
              </h2>
            </a>
            <p>{summary}</p>
          </section>
        ))}
        {missions.length === 0 && (
          <p>No missions have been entered for {year} so far.</p>
        )}
      </PageLayout>
    </Layout>
  );
};

export default MissionsPage;
