import React, { useState, useRef } from 'react';
import { profile } from '../data/portfolioData';
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, Send, Sparkles } from 'lucide-react';
import { useMagnetic } from '../animations/useMagnetic';

function MagneticItem({ children, className, href, onClick, target, rel, download }) {
  const ref = useRef(null);
  useMagnetic(ref, 0.22);

  const Component = href ? 'a' : 'button';
  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      download={download}
      className={`magnetic-link ${className || ''}`}
    >
      {children}
    </Component>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <span className="meta-tag">// 04 • CONTACT & COLLABORATION</span>
          <span className="font-mono text-xs text-muted">DIRECT CHANNEL</span>
        </div>

        <div className="contact-editorial-box">
          <div className="contact-left">
            <span className="contact-avail font-mono text-xs">
              <span className="status-indicator-dot mr-2 inline-block" />
              STATUS: OPEN TO FULL-TIME & CONTRACT ROLES
            </span>

            <h2 className="contact-display-headline font-display">
              LET'S BUILD SOMETHING EXCEPTIONAL.
            </h2>

            <p className="contact-desc font-sans text-secondary">
              Whether you are hiring for a high-impact engineering position, have a challenging system to architect,
              or want to discuss creative frontend interaction — my inbox is directly accessible.
            </p>

            {/* Email Action Bar with Quick Copy */}
            <div className="contact-email-card">
              <div className="email-meta">
                <span className="font-mono text-xs text-muted">PRIMARY INBOX</span>
                <span className="email-address-text font-mono">{profile.email}</span>
              </div>

              <div className="email-buttons">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn-secondary email-btn font-mono text-xs"
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-accent mr-1" />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="mr-1" />
                      COPY EMAIL
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${profile.email}`}
                  className="btn-primary email-btn font-mono text-xs"
                >
                  <Send size={14} className="mr-1" />
                  SEND MAIL
                </a>
              </div>
            </div>
          </div>

          {/* Social Channels & Resume */}
          <div className="contact-right">
            <h3 className="contact-subheading font-mono text-xs text-muted">
              CHANNELS & CREDENTIALS
            </h3>

            <div className="contact-links-stack">
              <MagneticItem
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-row"
              >
                <div className="channel-info">
                  <Github size={18} className="channel-icon" />
                  <div>
                    <div className="channel-title font-display">GitHub</div>
                    <span className="channel-sub font-mono text-xs text-muted">
                      hamzaKhan2004 • Repositories & Commits
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="channel-arrow" />
              </MagneticItem>

              <MagneticItem
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-row"
              >
                <div className="channel-info">
                  <Linkedin size={18} className="channel-icon" />
                  <div>
                    <div className="channel-title font-display">LinkedIn</div>
                    <span className="channel-sub font-mono text-xs text-muted">
                      hamza-khan-47a604347 • Professional Network
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="channel-arrow" />
              </MagneticItem>

              <MagneticItem
                href={profile.resumeUrl}
                download="Hamza_Akil_Khan_Resume.pdf"
                className="contact-channel-row"
              >
                <div className="channel-info">
                  <FileText size={18} className="channel-icon text-accent" />
                  <div>
                    <div className="channel-title font-display">Curriculum Vitae (PDF)</div>
                    <span className="channel-sub font-mono text-xs text-muted">
                      Hamza__Resume.pdf • Verified Credentials
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={18} className="channel-arrow" />
              </MagneticItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
