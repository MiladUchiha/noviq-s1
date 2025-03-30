'use client';

import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';
import styles from '../../components/Home/Hero/Hero.module.css';

export default function DebugPage() {
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true);
        // Simple query to test database connection
        const { data, error } = await supabase.from('users').select('count(*)', { count: 'exact' });
        
        if (error) {
          console.error('Supabase connection error:', error);
          setTestResult({
            success: false,
            error: error.message,
            details: error
          });
        } else {
          setTestResult({
            success: true,
            data
          });
        }
        
        // Check environment variables (public ones only)
        setEnvVars({
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set ✓' : 'Not set ✗',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✓' : 'Not set ✗',
          // Hide actual values for security reasons
        });
      } catch (err) {
        console.error('Test failed:', err);
        setTestResult({
          success: false,
          error: err.message,
          details: err
        });
      } finally {
        setLoading(false);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dashboardContainer}>
        <h1>Database Debug Page</h1>
        <p>This page tests the connection to your Supabase database.</p>
        
        <div className={styles.dashboardCard}>
          <h3>Environment Variables</h3>
          <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
        
        <div className={styles.dashboardCard}>
          <h3>Connection Test</h3>
          {loading ? (
            <p>Testing connection...</p>
          ) : testResult ? (
            <div>
              <div style={{ 
                padding: '0.75rem', 
                background: testResult.success ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                border: `1px solid ${testResult.success ? 'rgba(0,255,0,0.3)' : 'rgba(255,0,0,0.3)'}`,
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <p><strong>Status:</strong> {testResult.success ? 'Connection Successful ✓' : 'Connection Failed ✗'}</p>
                {!testResult.success && <p><strong>Error:</strong> {testResult.error}</p>}
              </div>
              
              <h4>Response Details:</h4>
              <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          ) : (
            <p>No test results available.</p>
          )}
        </div>

        <div className={styles.dashboardCard}>
          <h3>Next Steps</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>Make sure your Supabase project is active and properly configured.</li>
            <li>Check that your environment variables are correctly set.</li>
            <li>Ensure the SQL schema has been properly applied to your Supabase database.</li>
            <li>Add the <code>idea</code> column to your users table if it doesn't exist.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 