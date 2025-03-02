import { Fragment } from "react";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from 'next/head'

function MeetupDetailsPage({ meetupData }) {
    // Handle case where meetupData is still loading (when fallback: true)
    if (!meetupData) {
        return <p>Loading...</p>;
    }

    return (
    <Fragment>
            <Head>
                <title>{meetupData.title}</title>
                <meta name="description" content={meetupData.description}/>
            </Head>
        <MeetupDetail 
            image={meetupData.image}
            title={meetupData.title}
            address={meetupData.address}
            description={meetupData.description}
        />
      </Fragment>
    );
}

export async function getStaticPaths() {
    try {
        const client = await MongoClient.connect(
            'mongodb+srv://adelinojusto911:XgArD2Yufog7WynO@cluster0.ozcth.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
        );
        const db = client.db();
        const meetupCollection = db.collection("meetups");

        const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

        client.close();

        return {
            paths: meetups.map((meetup) => ({
                params: { meetupId: meetup._id.toString() },
            })),
            fallback: true, // Ensures new meetups can be generated dynamically
        };
    } catch (error) {
        console.log(error);
        return { paths: [], fallback: true };
    }
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    try {
        const client = await MongoClient.connect(
            'mongodb+srv://adelinojusto911:XgArD2Yufog7WynO@cluster0.ozcth.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
        );
        const db = client.db();
        const meetupCollection = db.collection("meetups");

        const selectedMeetup = await meetupCollection.findOne({ _id: new ObjectId(meetupId) });

        client.close();

        if (!selectedMeetup) {
            return { notFound: true };
        }

        return {
            props: {
                meetupData: {
                    id: selectedMeetup._id.toString(),
                    title: selectedMeetup.title || "No title available",
                    image: selectedMeetup.image || "https://via.placeholder.com/600", // Placeholder image
                    address: selectedMeetup.address || "No address available",
                    description: selectedMeetup.description || "No description available",
                },
            },
            revalidate: 10, // Regenerate page every 10 seconds
        };
    } catch (error) {
        console.error("Error fetching meetup data:", error);
        return { props: { meetupData: null }, revalidate: 10 };
    }
}

export default MeetupDetailsPage;
