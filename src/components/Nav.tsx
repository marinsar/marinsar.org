import { useRouter } from 'next/router';
import Link from 'next/link';
import { ExternalLinkIcon } from './ExternalLinkIcon';

const NAV_LINKS = [
  { text: 'What we do', url: '/what-we-do' },
  { text: 'Apply', url: '/apply' },
  { text: 'Donate', url: '/donate' },
  { text: 'Directions', url: '/directions' },
  { text: 'Calendar', url: '/calendar' },
  { text: 'Unit history', url: '/unit-history' },
  { text: 'Training', url: '/training' },
  { text: 'Pre-plan', url: '/pre-plan' },
  { text: 'Missions', url: '/missions' },
  { text: 'K9 team', url: '/k9-team' },
  { text: 'Photos', url: 'https://www.facebook.com/marinsar/photos' },
  { text: 'Members', url: 'https://sites.google.com/a/marinsar.org/members/' },
];

export const Nav = () => {
  const router = useRouter();

  return (
    <nav>
      <ul className='hidden sm:grid sm:grid-cols-2 sm:grid-rows-6 lg:grid-cols-3 lg:grid-rows-4 gap-x-8 grid-flow-col'>
        {NAV_LINKS.map(({ text, url }) => (
          <li key={url}>
            <Link href={url}>
              <a className='flex items-center hover:text-blue-500 whitespace-nowrap'>
                {text}
                {url.startsWith('http') && (
                  <ExternalLinkIcon className='ml-2 text-gray-200 fill-current' />
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <select
        role='navigation'
        value={router.asPath}
        className='text-gray-100 font-medium text-sm rounded bg-gray-800 sm:hidden'
        onChange={(e) => {
          router.push(e.target.value);
        }}
      >
        <option value='/'>Home</option>
        {NAV_LINKS.map(({ text, url }) => (
          <option key={url} value={url}>
            {text}
          </option>
        ))}
      </select>
    </nav>
  );
};
