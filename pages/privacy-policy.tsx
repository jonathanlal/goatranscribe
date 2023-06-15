import { Claims, getSession } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { H, P, Seperator, styled } from 'frostbyte';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx.req, ctx.res);

  return {
    props: {
      user: session?.user || null,
    },
  };
}

const Layout = styled('div', {
  padding: '3vw',
  minHeight: '100vh',
});
const Container = styled('div', {
  background: '$mauve2',
  padding: '20px',
  borderRadius: '5px',
});

const PrivacyPolicy = ({ user }: { user: Claims }) => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Layout>
          <Container>
            <H
              color="purple11"
              css={{
                marginBottom: '5px',
              }}
            >
              Privacy Policy
            </H>
            <P>Last updated: 2023-06-15</P>
            <Seperator
              color="purple8"
              css={{
                margin: '20px 0',
              }}
            />
            <P>
              Welcome to Goatranscribe.com ("we", "us", "our", "Goatranscribe").
              We respect the privacy of our users and are committed to
              protecting it through our compliance with this policy.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              1. INFORMATION WE COLLECT
            </H>
            <P>
              We may collect several types of information from and about users
              of our Website, including personal data, such as your name, email
              address, and billing information. We may also collect information
              automatically when you visit our website, including IP addresses,
              browser information, and information about your interactions with
              the website.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              2. HOW WE USE YOUR INFORMATION
            </H>
            <P>
              We use information that we collect about you or that you provide
              to us, including any personal information, to provide our
              Services, process transactions, send communications, maintain the
              safety, security, and integrity of our Services, and for any other
              purpose with your consent.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              3. DISCLOSURE OF YOUR INFORMATION
            </H>
            <P>
              We may disclose personal information that we collect or you
              provide as described in this privacy policy to our subsidiaries
              and affiliates; to contractors, service providers, and other third
              parties we use to support our business; to fulfill the purpose for
              which you provide it; and for any other purpose disclosed by us
              when you provide the information.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              4. DATA SECURITY
            </H>
            <P>
              We have implemented measures designed to secure your personal
              information from accidental loss and from unauthorized access,
              use, alteration, and disclosure.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              5. CHANGES TO OUR PRIVACY POLICY
            </H>
            <P>
              We may update our privacy policy from time to time. If we make
              material changes to how we treat our users' personal information,
              we will post the new privacy policy on this page.
            </P>
            <br />
            <br />
            <H
              color="purple11"
              as="h3"
              css={{
                marginBottom: '5px',
              }}
            >
              6. CONTACT INFORMATION
            </H>
            <P>
              To ask questions or comment about this privacy policy and our
              privacy practices, contact us at: support@goatranscribe.com
            </P>
          </Container>
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default PrivacyPolicy;
