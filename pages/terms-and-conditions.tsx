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
        <title>Terms And Conditions</title>
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
              Terms And Conditions
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
              Goatranscribe is a digital platform where users can upload audio
              or video files for transcription related services. By accessing or
              using our website and our services, you signify your agreement to
              be bound by these terms and conditions.
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
              1. DEFINITIONS
            </H>
            <P>
              <ul>
                <li>
                  "Services" refers to any services provided by Goatranscribe.
                </li>
                <li>
                  "Users", "you", "your" refers to anyone accessing our
                  services, either by visiting our website or using our platform
                  for transcription and translation.
                </li>
                <li>
                  "Content" means any text, graphics, images, music, software,
                  audio, video, information or other materials available on
                  Goatranscribe.
                </li>
              </ul>
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
              2. SERVICES
            </H>
            <P>
              Goatranscribe provides a platform for users to upload audio or
              video files which are transcribed and/or translated by various
              machine learning models including OpenAI, Azure Language Model,
              and others.
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
              3. ACCESS & USE OF THE SERVICES
            </H>
            <P>
              You agree to use the Services for lawful purposes only and in a
              way that does not infringe the rights of, restrict, or inhibit
              anyone else's use and enjoyment of the website. Unauthorized use
              may give rise to a claim for damages and/or be a criminal offense.
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
              4. USER RESPONSIBILITIES
            </H>
            <P>
              You are solely responsible for any content that you upload and the
              consequences of uploading and publishing them on Goatranscribe.
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
              5. COPYRIGHT
            </H>
            <P>
              All intellectual property rights in and to the content available
              on our platform are owned by us, our licensors, or both.
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
              6. INDEMNITY
            </H>
            <P>
              You agree to defend, indemnify, and hold us harmless from and
              against any claims, liabilities, damages, losses, and expenses,
              including, without limitation, reasonable legal and accounting
              fees, arising out of or in any way connected with your access to
              or use of the Services.
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
              7. CHANGES TO TERMS
            </H>
            <P>
              We reserve the right to modify these terms at any time, so please
              review them frequently. Changes and clarifications will take
              effect immediately upon their posting on the website.
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
              8. PRIVACY
            </H>
            <P>
              Our collection and use of personal information in connection with
              your access to and use of the Services is described in our Privacy
              Policy.
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
              8. GOVERNING LAW
            </H>
            <P>
              These terms and conditions are governed by and construed in
              accordance with the laws of the EU and you irrevocably submit to
              the exclusive jurisdiction of the courts in that location.
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
              8. CONTACT US
            </H>
            <P>
              If you have any questions about these Terms, please contact
              Goatranscribe at support@goatranscribe.com
            </P>
          </Container>
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default PrivacyPolicy;
