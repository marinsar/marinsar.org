import { FunctionComponent } from 'react';
import Link from 'next/link';

import { Layout } from '../components/Layout';
import { getMissionYears } from '../lib/utils';
import { PageLayout } from '../components/PageLayout';

const MissionsIndexPage: FunctionComponent = ({}) => {
  const years = getMissionYears();

  return (
    <Layout title='Missions'>
      <PageLayout>
        <h1>Missions</h1>
        <p>Browse past missions by year:</p>
        <ul>
          {years.map((year) => (
            <li key={year}>
              <Link legacyBehavior href={`/missions/${year}`}>
                <a>{year}</a>
              </Link>
            </li>
          ))}
        </ul>
      </PageLayout>
    </Layout>
  );
};

export default MissionsIndexPage;
