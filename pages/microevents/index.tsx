import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Microevent } from '../../domain/microevents';

const MicroeventsPage: NextPage = () => {
  const [microevents, setMicroevents] = useState<Microevent[] | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:8080/microevents');
      const _microevents = await response.json();
      setMicroevents(_microevents);
    })();
  }, []);

  return (
    <div>
      <h2>Microevents</h2>
      {microevents ? (
        <ul>
          {microevents.map((me) => (
            <li key={me.id}>
              {me.title} -{' '}
              <Link href={`microevents/${me.id}`}>
                <a>Detail</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <span>Loading ...</span>
      )}
    </div>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<{}>> {
  console.log('revalidate');

  return {
    props: {},
    revalidate: 10, // In seconds
  };
}

export default MicroeventsPage;
