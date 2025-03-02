import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import NewMeetupForm from "../../components/meetups/NewMeetupForm"
import Head from 'next/head'
import { Fragment } from 'react';

function NewMeetupPage(){
    const route = useRouter();
    async function addMeetupHandler(enteredMeetupData){
        console.log(enteredMeetupData);
        const response = await fetch("/api/new-meetup", {
            method: "POST",
            body: JSON.stringify(enteredMeetupData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log(data);
        route.push('/')
    }
    return (
    <Fragment>
            <Head>
                <title>ReactMeetup</title>
                <meta name="description" content="Insert New Meetup!"/>
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler}/>
    </Fragment>
    

    )
}
export default NewMeetupPage;