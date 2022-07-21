import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Image from 'next/image';
import { Microevent } from '../../domain/microevents';
import { Peer } from '../../domain/peers';

export interface MicroeventDetailPageParams {
  id: string;
}

export interface MicroeventDetailPageProps {
  microevent: Microevent;
  peers: Peer[];
}

const MicroeventDetailPage: NextPage<MicroeventDetailPageProps> = ({ microevent, peers }) => {
  return (
    <div>
      <h2>Microevent Detail</h2>
      {microevent.title}
      {peers.map((peer) => (
        <Image key={peer.id} alt={peer.name} src={peer.pictureUrl} width={40} height={40} />
      ))}
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<MicroeventDetailPageProps>> {
  // Fetch data from external API
  const id = (context.params as any).id;
  const microeventRes = await fetch(`http://localhost:8080/microevents/${id}`);
  const microevent: Microevent = await microeventRes.json();

  const peers: Peer[] = await Promise.all(
    microevent.peerIds.map(async (peerId) => {
      const peerRes = await fetch(`http://localhost:8080/peers/${peerId}`);
      const peer = await peerRes.json();
      return peer;
    }),
  );

  // Pass data to the page via props
  return { props: { microevent, peers } };
}

export default MicroeventDetailPage;
