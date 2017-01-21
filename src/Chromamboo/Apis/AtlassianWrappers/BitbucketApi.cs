﻿using System;
using System.Configuration;
using System.Text;
using System.Threading.Tasks;

using Chromamboo.Contracts;

using Newtonsoft.Json.Linq;

using RestSharp;
using RestSharp.Authenticators;

namespace Chromamboo.Apis.AtlassianWrappers
{
    internal class BitbucketApi : IBitbucketApi
    {
        private readonly string apiBaseUrl;

        private readonly string projectKey;

        private readonly string repoSlug;

        private readonly string password;

        private readonly string username;

        public BitbucketApi(string apiBaseUrl, string projectKey, string repoSlug, string username, string password)
        {
            if (password != null)
            {
                this.password = password;
            }

            if (username != null)
            {
                this.username = username;
            }

            this.apiBaseUrl = apiBaseUrl;
            this.projectKey = projectKey;
            this.repoSlug = repoSlug;
        }

        public async Task<string> GetCommitDetails(string commitHash)
        {
            var rc = new RestClient(this.apiBaseUrl);
            rc.Authenticator = new HttpBasicAuthenticator(this.username, this.password);
            var request = new RestRequest($"/projects/{this.projectKey}/repos/{this.repoSlug}/commits/{commitHash}");
            rc.Authenticator.Authenticate(rc, request);
            var result = await rc.ExecuteTaskAsync(request);
            return result.Content;
        }

        public async Task<int> GetAwaitingPullRequestCountAsync()
        {
            var rc = new RestClient(this.apiBaseUrl);
            rc.Authenticator = new HttpBasicAuthenticator(this.username, this.password);
            var request = new RestRequest($"/inbox/pull-requests/count");
            rc.Authenticator.Authenticate(rc, request);
            var result = await rc.ExecuteTaskAsync(request);
            return JObject.Parse(result.Content)["count"].Value<int>();
        }
    }
}