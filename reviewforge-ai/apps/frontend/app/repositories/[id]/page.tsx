'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type RepositoryItem = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
};
type SelectedFile = {
  name: string;
  path: string;
  size: number;
  sha: string;
  content: string;
};

export default function RepositoryPage() {
  return <h1>HEY</h1>;
}
