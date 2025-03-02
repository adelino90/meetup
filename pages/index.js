import { MongoClient } from 'mongodb';
import MeetupList from "../components/meetups/MeetupList";
import Head from 'next/head'
import { Fragment } from 'react';

function HomePage({ data }) {

    return (
    <Fragment>
        <Head>
            <title>ReactMeetup</title>
            <meta name="description" content="Browse a huge list of highly active React meetups!"/>
        </Head>
        <MeetupList meetups={data} />
    </Fragment>
    
    );
}

export async function getStaticProps() {
    try {
        const client = await MongoClient.connect(
            'mongodb+srv://adelinojusto911:yJprhQ6XTwZCbxl5@cluster0.ozcth.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
        );
        const db = client.db();
        const meetupCollection = db.collection('meetups');

        const meetups = await meetupCollection.find().toArray();

        client.close();

        return {
            props: {
                data: meetups.map(meetup => ({
                    id: meetup._id.toString(),
                    title: meetup.title,
                    address: meetup.address,
                    image: meetup.image
                }))
            },
            revalidate: 10
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                data: []
            }
        };
    }
}

export default HomePage;
