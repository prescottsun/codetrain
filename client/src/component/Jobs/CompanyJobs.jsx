import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Moment from "react-moment";
import Axios from "axios";
import CreateJobPost from "./CreateJobPost";
import {
  Card,
  CardHeader,
  CardHeaderTitle,
  CardContent,
  Content,
  CardFooter,
  CardFooterItem
} from "bloomer";
import styled from "styled-components";

import { Button } from "../Styles/FormStyles";
import { Anchor } from "../Styles/navStyles";

// This component fetches all the data that will populate each job post
const CompanyJobs = () => {
  const user = useSelector(state => state.user);
  const [jobs, setJobs] = useState([]);

  const fetchJobsData = async () => {
    const endpoint = `http://localhost:3000/posts/jobs/company/${user.companies_id}`;
    const res = await Axios.get(endpoint);
    const activeJobs = res.data.filter(job => job.is_active === true)
    setJobs(activeJobs);
  };

  // the 2nd empty array argument prevents infinite re-renders.
  useEffect(() => {
    fetchJobsData();
  }, []);

  // mapping over data and passing job data as props to the Job Card which renders job posts
  return (
    <>
      <Link to={`/create-job`}>
        <Button>Create a job post!</Button>
      </Link>
      <JobCardWrapper>
        {jobs.map(job => {
          return <JobCard key={job.id} data={job} />;
        })}
      </JobCardWrapper>
    </>
  );
};

// These are the actual job posts. They receive data from the JobBoard component.
const JobCard = props => {
  const { data } = props;
  const [companyData, setCompanyData] = useState([]);

  const fetchCompanyData = async () => {
    const endpoint = `http://localhost:3000/companies/id/${data.companies_id}`;
    const res = await Axios.get(endpoint);
    setCompanyData(res.data);
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <Card style={{ maxWidth: "400px", margin: "20px", display: "flex", flexDirection: "column" }}>
      <CardHeader>
        <CardHeaderTitle>{data.title}</CardHeaderTitle>
      </CardHeader>
      <CardContent>
        <Content>
          <strong>Date Posted: </strong>
          <Moment format="YYYY-MM-DD">{data.date_posted}</Moment>
        </Content>
        <Content>
          <strong>Experience: </strong> {data.experience}
        </Content>
        <Content>
          <strong>Company Name: </strong>
          <Link to={`/company/${companyData.id}`}>{companyData.name}</Link>
        </Content>
        <Content>
          <strong>Contact Email: </strong>
          {data.contact_email}
        </Content>
      </CardContent>
      <CardFooter style={{marginTop: "auto"}} >
        <CardFooterItem>
          <Button>
            <Link to={`/jobs/${data.id}`}>View Details</Link>
          </Button>
        </CardFooterItem>
      </CardFooter>
    </Card>
  );
};

const JobCardWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`;

export default CompanyJobs;
